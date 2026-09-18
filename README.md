# Bantay PH

**Bantay PH** ("bantay" = watch/guard in Filipino) is a full-stack community issue-reporting platform for barangay-level (Philippine local government) governance. Residents report local problems — potholes, flooding, garbage, broken streetlights — and each report moves through a verification and resolution pipeline handled by validators and barangay staff, with role-based access control and a full audit trail.

```
bantay-ph/
├── server/   # Node.js + Express + Prisma + MySQL API
└── client/   # React + TypeScript + Tailwind + TanStack Query frontend
```

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Report Lifecycle](#report-lifecycle)
- [Roles & Permissions](#roles--permissions)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [API Reference](#api-reference)
- [Error Format](#error-format)
- [Security Notes](#security-notes)
- [Struggles & Trade-offs](#struggles--trade-offs)
- [Roadmap](#roadmap)

---

## Overview

A resident submits a report with a category, description, and location. A **validator** claims it from the verification queue and confirms, rejects, or flags it as a duplicate. Once confirmed, it enters the **barangay staff** queue, where staff assign it to themselves, work it, and mark it resolved. Every transition is written to a status-history table and an audit log, so the full paper trail of who did what — and when — is always reconstructable.

Access to every endpoint is governed by a **role → permission** system stored in the database (not hardcoded in route files), so permissions can evolve without redeploying route logic.

## Tech Stack

**Backend**

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express 5 |
| Database | MySQL |
| ORM | Prisma |
| Auth | JWT (HTTP-only cookie) + bcrypt |
| Validation | Zod |
| Security middleware | Helmet, CORS, express-rate-limit |
| Testing | Jest + Supertest |

**Frontend**

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript (Vite) |
| Styling | Tailwind CSS 4 |
| Server state | TanStack Query |
| Client state | Zustand |
| Routing | React Router 7 |
| HTTP | Axios |
| Maps | React-Leaflet + Leaflet |

## Architecture

### Backend

A **modular, layered structure**. Each domain module (`auth`, `reports`, `verifications`, `admin`) is self-contained with its own routes, controller, service, and validation layer:

```
Request → Route → Middleware (auth / permission / validation) → Controller → Service → Prisma → MySQL
```

- **Routes** wire HTTP verbs/paths to middleware and controllers — no business logic.
- **Controllers** are thin: pull validated input from `res.locals.validated`, call a service, shape the response.
- **Services** hold all business logic and Prisma queries, including transactional writes (e.g. status change + history log + audit log happen atomically).
- **Validation** (Zod) parses and strictly types `body` / `params` / `query` before a request ever reaches a controller.
- **Middleware** enforces authentication, account status, and fine-grained permissions independently of each other, so they can be composed per-route.

### Frontend

Organized **by feature**, not by file type — `features/reports`, `features/verifications`, `features/staff`, `features/admin`, `features/auth` each bundle their own API calls, TanStack Query hooks, components, and types.

- **`lib/api/http.ts`** — a single Axios instance with `withCredentials: true` (required for the cookie-based session) and a response interceptor that normalizes every backend error into one `ApiError` shape before it ever reaches a component.
- **`stores/authStore.ts`** (Zustand) — holds the current `user`, their `permissions` array, and a `bootstrapped` flag so route guards never flash a "logged out" state during the initial `GET /me` check.
- **Route guards** (`RequireAuth`, `RequirePermissions`, `RedirectIfAuthed`) compose in `AppRouter.tsx` to gate pages by session and by permission string — mirroring the backend's own `requireAuth` / `requirePermission` split, so the same mental model applies on both ends.
- **TanStack Query** owns all server state (reports, queues, users, audit logs) — no server data is duplicated into Zustand, keeping cache invalidation the single source of truth after mutations (assign, verify, status update, etc.).
- **React-Leaflet** powers the location picker on report submission, storing plain `latitude`/`longitude` decimals rather than any provider-specific geodata.

## Database Schema

MySQL via Prisma. `server/prisma/schema.prisma` is the single source of truth; migrations live in `server/prisma/migrations/`.

### Entity-relationship overview

```
Role ──< RolePermission >── Permission
  │
  │ 1
  ▼ *
User ──< Report (as reporter) >── User (as assignee, optional)
  │            │
  │            ├──< ReportPhoto
  │            ├──< ReportVerification >── User (as validator)
  │            ├──< ReportComment      >── User
  │            └──< ReportStatusHistory >── User (as author)
  │
  └──< AuditLog
```

### Table-by-table

**`roles`** / **`permissions`** / **`role_permissions`**
A classic many-to-many RBAC join. `role_permissions` is a composite-key join table (`@@id([roleId, permissionId])`) with `onDelete: Cascade` on both sides — deleting a role or permission cleans up its mappings automatically, so RBAC data never orphans. Permissions are resolved **at request time** from a user's role, not baked into a JWT claim, which means revoking a permission from a role takes effect on the user's very next request instead of only after their token expires.

**`users`**
- `id` is a UUID (`@db.VarChar(36)`), not an auto-increment int — deliberate, so IDs are never guessable/enumerable and stay stable if the table is ever sharded or merged with another system.
- `status` (`ACTIVE` / `INACTIVE`) is a soft-disable flag, checked on every authenticated request via `requireActiveAccount` — deactivating a user blocks them immediately without having to revoke or blacklist an already-issued JWT.
- `passwordHash` never leaves the service layer; no `select: { passwordHash: true }` exists outside the auth module.

**`reports`** — the central entity.
- `category` and `status` are **Prisma/MySQL enums**, not free-text columns — this pushes invalid values back to a schema error at the DB level, not just app-level validation.
- `latitude` / `longitude` are `Decimal(10,7)` (not `Float`) — floating point would silently accumulate rounding error on repeated writes/reads of coordinates; `Decimal` guarantees the exact value submitted is the exact value stored, which matters when a location pin is used to route a physical crew.
- `assignedToId` is nullable with `onDelete: SetNull` — if an assigned staff account is ever deleted, the report survives and simply becomes unassigned again rather than being deleted or orphaned.
- `reporterId` uses `onDelete: Restrict` — a user with existing reports **cannot** be hard-deleted, only deactivated. This is intentional: it protects the historical record (and the audit trail) from silently losing its origin.
- Indexed on `status`, `reporterId`, and `assignedToId` — these three are exactly the columns every queue/list endpoint filters on (`staff/queue`, `mine`, `feed`), so lookups stay index-backed as data grows.

**`report_verifications`**
- `@@unique([reportId, validatorId])` — a single validator cannot submit two verification decisions for the same report. This is enforced at the database level, not just in application logic, so it holds even under concurrent requests.
- `validatorId` uses `onDelete: Restrict` for the same reason as `reporterId`: a verification decision is a historical fact and must not disappear if the validator's account is later removed.

**`report_comments`**
A simple flat (non-threaded) comment log per report, indexed on `reportId` and `userId`.

**`report_status_history`**
- `oldStatus` is nullable (the very first row, `REPORTED`, has no prior status) while `newStatus` is required.
- This table is **append-only** by convention — nothing in the service layer ever updates or deletes a row here. It's the audit-grade record of the state machine described below, independent of the `reports.status` column itself (which only ever holds the *current* state).

**`audit_logs`**
A generic, entity-agnostic action log: `action`, `entityType`, `entityId`, `details` (JSON-ish text). Deliberately decoupled from any specific foreign key (`entityId` is a plain string, not a relation) so the same table can log actions against reports, users, or anything added later without a schema migration.

**`report_photos`**
Storage-provider agnostic: stores a `url`, an optional `provider` name, and an optional `providerFileId`, rather than assuming a specific storage backend (S3, Cloudinary, local disk, etc.). This table was added in a **second migration** after the initial schema — see [Struggles & Trade-offs](#struggles--trade-offs).

### Why Prisma + MySQL

Prisma's generated client gives compile-time-checked queries and painless relational includes (`report.findMany({ include: { reporter: true, verifications: true } })`), while migrations stay plain, reviewable SQL in version control. MySQL was chosen over a document store because the domain is inherently relational — reports, users, roles, permissions, and their history all reference each other by foreign key, and several of those relationships (one verification per validator per report, cascade rules on delete) are exactly the kind of constraint a relational database enforces for free.

## Report Lifecycle

Reports move through a strict, enforced state machine — invalid transitions are rejected with a `409`:

```
REPORTED ──► UNDER_VERIFICATION ──► VERIFIED ──► ASSIGNED ──► IN_PROGRESS ──► RESOLVED
    │                │
    └──► REJECTED    ├──► REJECTED
                      └──► DUPLICATE
```

| Stage | Trigger | Who |
|---|---|---|
| `REPORTED` | Resident submits a report | Resident |
| `UNDER_VERIFICATION` | Validator claims it from the queue | Validator |
| `VERIFIED` / `REJECTED` / `DUPLICATE` | Validator records a verification decision | Validator |
| `ASSIGNED` | Staff assigns a verified report to themselves | Barangay Staff |
| `IN_PROGRESS` | Staff starts work | Barangay Staff (assignee only) |
| `RESOLVED` | Staff completes the fix | Barangay Staff (assignee only) |

Every transition is recorded in `report_status_history`, and status-changing actions write to `audit_logs`. Assignment and status updates use `updateMany` guarded by the expected current state inside a transaction, preventing race conditions from two staff members acting on the same report simultaneously.

## Roles & Permissions

Four roles, seeded with a granular permission set (`server/prisma/seed.ts`):

| Role | Responsibilities |
|---|---|
| `RESIDENT` | Submit reports, view own reports and their history, comment, browse the public feed of verified reports |
| `VALIDATOR` | Review the verification queue, claim reports, confirm/reject/mark duplicate |
| `BARANGAY_STAFF` | Work the queue of verified reports, assign to self, progress and resolve |
| `ADMIN` | Manage users (roles/status), view audit logs, holds every permission |

Permissions are checked at request time via `requirePermission("permission:name")` on the backend, and mirrored on the frontend via `RequirePermissions` route guards and `useAuthStore().hasAnyPermission()` — both read the same permission-string array returned by `GET /api/auth/me`, so UI gating and API enforcement never drift out of sync.

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma          # Data model
│   ├── seed.ts                 # Roles, permissions, role-permission map, default admin
│   └── migrations/
├── src/
│   ├── modules/
│   │   ├── auth/                # register, login, me, logout
│   │   ├── reports/              # create, list, feed, staff queue, assign, status, comments, history
│   │   ├── verifications/        # verification queue, claim, verify
│   │   └── admin/                 # user management, audit logs
│   ├── middleware/
│   │   ├── requireAuth.middleware.ts        # verifies JWT cookie, loads user + permissions
│   │   ├── requireActive.middleware.ts      # blocks INACTIVE accounts
│   │   ├── requirePermission.middleware.ts  # RBAC permission gate
│   │   ├── validateRequest.middleware.ts    # Zod request validation
│   │   └── rateLimiter.middleware.ts
│   ├── common/
│   │   ├── auth/                # jwt, cookie, password hashing, token signing
│   │   ├── errors/               # HttpError, asyncHandler
│   │   └── utility/               # pagination helper
│   ├── config/env.ts
│   ├── db/prisma.ts
│   ├── app.ts                    # Express app: security middleware, routes, error handler
│   ├── server.ts                 # entrypoint
│   └── routes.ts                 # top-level router
└── tests/
    ├── auth.test.ts
    ├── rbac.test.ts
    └── workflow.test.ts

client/
├── src/
│   ├── app/
│   │   ├── layout/               # AppLayout, PublicLayout, Sidebar, TopNav
│   │   ├── providers/            # AuthBootstrapper, QueryProvider
│   │   └── router/                # AppRouter, routes.tsx, guards/
│   ├── features/
│   │   ├── auth/                  # api, hooks (useMeQuery, useAuthMutations)
│   │   ├── reports/                # api, components, hooks, map (LeafletPicker), types
│   │   ├── verifications/          # api, components, hooks, types
│   │   ├── staff/                   # api, components, hooks, types
│   │   └── admin/                   # api, components, hooks, types
│   ├── pages/                      # one file per route (Login, FeedPage, StaffQueuePage, ...)
│   ├── shared/ui/                   # FullPageLoader, Pagination
│   ├── stores/authStore.ts           # Zustand: user, permissions, bootstrapped
│   └── lib/api/http.ts               # Axios instance + error normalization
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MySQL database (local or hosted)

### Installation

```bash
# Backend
cd server
npm install

# Frontend (separate terminal)
cd client
npm install
```

### Setup

1. Create a `.env` file in `server/` (see [Environment Variables](#environment-variables)).
2. Run migrations:

   ```bash
   cd server
   npx prisma migrate deploy
   ```

3. Seed roles, permissions, and a default admin account:

   ```bash
   npx prisma db seed
   ```

4. (Optional) Create a `.env` in `client/` with `VITE_API_URL=http://localhost:5000/api` if the API doesn't run on the default host/port.

## Environment Variables

### `server/.env`

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | MySQL connection string, e.g. `mysql://user:pass@localhost:3306/bantay_ph` |
| `PORT` | – | Port the server listens on (default `5000`) |
| `JWT_SECRET` | ✅ | Secret used to sign/verify auth JWTs |
| `JWT_EXPIRES_IN` | – | Token lifetime, e.g. `1d` (default `1d`) |
| `COOKIE_NAME` | ✅ | Name of the cookie the server reads the JWT from |
| `AUTH_COOKIE_NAME` | – | Name of the cookie the server *sets* on login (defaults to `access_token`) |
| `AUTH_COOKIE_DOMAIN` | – | Cookie domain, if applicable |
| `AUTH_COOKIE_MAX_AGE_MS` | – | Cookie max-age in milliseconds |
| `AUTH_COOKIE_SAMESITE` | – | `lax` / `strict` / `none` (defaults to `none` in production, `lax` otherwise) |
| `AUTH_COOKIE_SECURE` | – | `true` / `false` (defaults to `true` in production) |
| `BCRYPT_SALT_ROUNDS` | – | Salt rounds for password hashing, 8–15 (default `10`) |
| `SEED_ADMIN_EMAIL` | – | Email for the seeded admin account (default `admin@bantay.ph`) |
| `SEED_ADMIN_PASSWORD` | – | Password for the seeded admin account (default `Admin12345!`) |
| `NODE_ENV` | – | `development` / `production` / `test` |

> ⚠️ **`COOKIE_NAME` and `AUTH_COOKIE_NAME` must match.** Login sets the cookie under `AUTH_COOKIE_NAME` (or its default), while `requireAuth` reads it back under `COOKIE_NAME`. Keep both set to the same value or authentication will silently fail — the login request succeeds, but every subsequent request 401s.

> Change `SEED_ADMIN_PASSWORD` before seeding a production database, and always set a strong, unique `JWT_SECRET`.

### `client/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | – | Base URL of the API (default `http://localhost:5000/api`) |

## Running the App

```bash
# Backend — from server/
npm run dev      # dev server with auto-restart
npm run build && npm start   # production

# Frontend — from client/
npm run dev       # Vite dev server (default: http://localhost:5173)
npm run build      # production build
```

The API is mounted under `/api`. A health check is available at `GET /api/health`. CORS on the backend is configured to allow `http://localhost:5173` with credentials enabled — update `server/src/app.ts` if the frontend runs elsewhere.

## Testing

```bash
cd server
npm test
```

Tests run against a dedicated test database (via `NODE_ENV=test`) using Jest + Supertest, covering:

- **`auth.test.ts`** — registration and login flows
- **`rbac.test.ts`** — role-based access control enforcement
- **`workflow.test.ts`** — the full report lifecycle, end to end

## API Reference

All routes are prefixed with `/api`. Endpoints marked 🔒 require authentication (a valid session cookie) and an `ACTIVE` account; the required permission is noted where applicable.

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Liveness check |

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | – | Register a new resident account |
| `POST` | `/login` | – | Log in; sets the auth cookie |
| `GET` | `/me` | 🔒 | Get the current user's profile and permissions |
| `POST` | `/logout` | 🔒 | Clear the auth cookie |

### Reports — `/api/reports`

| Method | Path | Permission | Description |
|---|---|---|---|
| `POST` | `/` | `report:create` | Submit a new report |
| `GET` | `/mine` | `report:read:own` | List the current user's reports (paginated, filterable by category/status) |
| `GET` | `/feed` | `report:feed:read` | Browse publicly visible reports (verified and beyond), paginated |
| `GET` | `/:id` | 🔒 | Get a single report by ID (residents can only view their own or feed-visible reports) |
| `GET` | `/staff/queue` | `report:staff_queue:read` | List verified, unassigned reports awaiting staff pickup |
| `POST` | `/:id/assign` | `report:assign` | Assign a verified report to yourself |
| `PATCH` | `/:id/status` | `report:update_status` | Move an assigned report to `IN_PROGRESS` or `RESOLVED` (assignee only) |
| `POST` | `/:id/comments` | `report:comment` | Add a comment to a report |
| `GET` | `/:id/comments` | 🔒 | List a report's comments |
| `GET` | `/:id/history` | 🔒 | List a report's status change history |

### Verifications — `/api/verifications`

| Method | Path | Permission | Description |
|---|---|---|---|
| `GET` | `/queue` | `verification:queue:read` | List reports awaiting verification (status `REPORTED`) |
| `POST` | `/:id/claim` | `report:claim_verification` | Claim a report for review (`REPORTED` → `UNDER_VERIFICATION`) |
| `POST` | `/:id/verify` | `report:verify` | Record a decision: `CONFIRMED`, `REJECTED`, or `DUPLICATE` |

### Admin — `/api/admin`

| Method | Path | Permission | Description |
|---|---|---|---|
| `GET` | `/users` | `user:read` | List users, filterable by search term, role, status |
| `PATCH` | `/users/:id/role` | `user:update_role` | Change a user's role |
| `PATCH` | `/users/:id/status` | `user:update_status` | Activate or deactivate a user account |
| `GET` | `/audit-logs` | `audit:read` | List audit log entries, filterable by action/entity/user |

All list endpoints share the same pagination shape: `?page=1&limit=10`, returning `{ page, limit, total, totalPages, ... }`.

## Error Format

Errors are returned as JSON with a consistent shape:

```json
{
  "message": "Human-readable message",
  "code": "MACHINE_READABLE_CODE",
  "details": { }
}
```

Common codes include `VALIDATION_ERROR` (400), `AUTH_REQUIRED` / `AUTH_MISSING_TOKEN` / `AUTH_INVALID_TOKEN` (401), `AUTH_FORBIDDEN` / `AUTH_INACTIVE` / `REPORT_FORBIDDEN` (403), `REPORT_NOT_FOUND` (404), and conflict codes like `INVALID_STATUS_TRANSITION`, `REPORT_NOT_ASSIGNABLE`, `REPORT_NOT_CLAIMABLE` (409). The frontend's Axios interceptor (`lib/api/http.ts`) normalizes every one of these into a single `ApiError` shape before it reaches a component, so UI error handling never has to branch on Axios internals.

## Security Notes

- Passwords are hashed with bcrypt (configurable salt rounds) and never returned in any response.
- Sessions use an HTTP-only, `SameSite`-aware cookie carrying a signed JWT — not accessible to client-side JS, and the frontend never touches the token directly (`withCredentials: true` handles it transparently).
- `helmet` sets standard security headers; `express-rate-limit` throttles all `/api` traffic.
- Every request body/query/params is strictly validated with Zod (`.strict()` schemas reject unknown fields).
- State-changing operations (assignment, status updates) use conditional `updateMany` guards inside a transaction to prevent race conditions between concurrent staff/validators.
- Deactivating a user (`status: INACTIVE`) immediately blocks further access via `requireActiveAccount`, without needing to revoke the existing token.
- Route protection is enforced **twice**, independently: server-side via `requireAuth`/`requirePermission` (the real boundary) and client-side via `RequireAuth`/`RequirePermissions` (purely a UX nicety to avoid flashing content the user can't act on — never treated as a security control).

## Struggles & Trade-offs

Honest notes on decisions that weren't obvious up front, and what I'd reconsider:

- **Cookie-name duplication (`COOKIE_NAME` vs `AUTH_COOKIE_NAME`).** The cookie the server *sets* on login and the cookie name `requireAuth` *reads* on every other request come from two separate env vars. Missing this during setup causes a confusing failure mode: login returns `200`, but every subsequent request 401s as if the user were never logged in. In hindsight, these should collapse into a single `COOKIE_NAME` used everywhere — I've documented the gotcha above rather than risk a rename breaking an already-seeded deployment.
- **Permission checks resolved per-request instead of baked into the JWT.** This was a deliberate trade-off: storing permissions in the token would mean a smaller, faster auth check, but a permission change wouldn't take effect until the user's token expired (or they logged out/in again). Resolving permissions from the database on every request costs one extra query per authenticated call, but it means deactivating a user or changing their role is instant — which matters more for a moderation-heavy app like this than the marginal latency does.
- **`report_photos` was added in a second migration, not the original schema.** The initial schema shipped without photo support; adding it later (rather than designing it in from day one) meant retrofitting a `ReportPhoto` relation onto an already-migrated `reports` table instead of getting it right the first time. The upload endpoint itself isn't wired yet — the schema and relations exist, but there's no `POST /reports/:id/photos` route yet (see [Roadmap](#roadmap)). Designing the table provider-agnostic (`url` + optional `provider`/`providerFileId`) was a deliberate hedge so that decision — S3 vs. Cloudinary vs. local disk — doesn't require another migration later.
- **`Decimal(10,7)` for coordinates instead of `Float`.** Caught this during schema review, not on the first pass — `Float`/`Double` columns can introduce rounding drift on repeated read/write cycles, which is a real problem when a coordinate is used to dispatch a physical crew to a location. Switching to `Decimal` costs a small amount of storage and requires the ORM layer to serialize/deserialize as a string or `Decimal.js` object instead of a plain JS number, which added a bit of friction on the frontend (coordinates have to be explicitly cast when read from the API) — worth it for correctness.
- **Restrict vs. Cascade on delete, chosen per-relation, not globally.** `reporterId` and `validatorId` use `onDelete: Restrict` (a user with reports/verifications can't be hard-deleted — only deactivated), while `assignedToId` uses `onDelete: SetNull` (a report survives even if its assignee is removed) and photos/comments/verifications/history cascade-delete with their parent report. Getting this consistent took a second pass through the schema — the guiding rule that emerged was: **anything that represents a historical decision (who verified, who reported) is protected; anything that's just current-state metadata (who's currently assigned) degrades gracefully instead.**
- **Client-side route guards vs. relying on the API alone.** Since permissions are already checked server-side on every request, the frontend guards (`RequireAuth`, `RequirePermissions`) are strictly a UX layer — they stop a user from ever seeing a page they can't act on, rather than being a security boundary. It would have been simpler to skip them and just let API calls fail with 403s, but that produces a worse experience (a flash of a page followed by an error) for very little implementation cost saved.
- **No refresh-token rotation yet.** Sessions rely on a single JWT with a fixed expiry (`JWT_EXPIRES_IN`) rather than an access/refresh token pair. This is simpler to reason about and sufficient for the current scope, but it means a long expiry trades off convenience for a longer exposure window if a cookie were ever compromised, while a short expiry means more frequent forced re-logins. This is the most likely next security improvement (see [Roadmap](#roadmap)).

## Roadmap

- Wire the `POST /reports/:id/photos` upload endpoint against `ReportPhoto` (schema and relations are already in place)
- Refresh-token rotation instead of a single long-lived JWT
- Map-based report clustering/visualization on the public feed
- Deployed demo + Postman/OpenAPI collection
