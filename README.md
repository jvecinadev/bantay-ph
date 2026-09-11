# Bantay PH — Backend API

**Bantay PH** ("bantay" = watch/guard in Filipino) is a community issue-reporting backend for barangay-level governance. Residents report local problems potholes, flooding, garbage, broken streetlights and the report moves through a verification and resolution pipeline handled by validators and barangay staff, with full role-based access control and an audit trail.

This repository contains the **backend API only**. The frontend is a separate, upcoming project.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Domain Model](#domain-model)
- [Report Lifecycle](#report-lifecycle)
- [Roles & Permissions](#roles--permissions)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database & Seeding](#database--seeding)
- [Running the Server](#running-the-server)
- [Testing](#testing)
- [API Reference](#api-reference)
- [Error Format](#error-format)
- [Security Notes](#security-notes)
- [Roadmap](#roadmap)

---

## Overview

A resident submits a report with a category, description, and location. A **validator** claims it from the verification queue and confirms, rejects, or flags it as a duplicate. Once confirmed, it enters the **barangay staff** queue, where staff assign it to themselves, work it, and mark it resolved. Every transition is written to a status history table and an audit log, so the full paper trail of who did what is always reconstructable.

Access to every endpoint is governed by a **role → permission** system stored in the database (not hardcoded in route files), so permissions can evolve without redeploying route logic.

## Tech Stack

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

## Architecture

The codebase follows a **modular, layered structure**. Each domain module (`auth`, `reports`, `verifications`, `admin`) is self-contained with its own routes, controller, service, and validation layer:

```
Request → Route → Middleware (auth / permission / validation) → Controller → Service → Prisma → MySQL
```

- **Routes** wire HTTP verbs/paths to middleware and controllers — no business logic.
- **Controllers** are thin: pull validated input from `res.locals.validated`, call a service, shape the response.
- **Services** hold all business logic and Prisma queries, including transactional writes (e.g. status change + history log + audit log happen atomically).
- **Validation** (Zod) parses and strictly types `body` / `params` / `query` before a request ever reaches a controller.
- **Middleware** enforces authentication, account status, and fine-grained permissions independently of each other, so they can be composed per-route.

## Domain Model

Core entities (see `server/prisma/schema.prisma` for the full schema):

- **User** — belongs to a `Role`; has a status (`ACTIVE` / `INACTIVE`).
- **Role** / **Permission** / **RolePermission** — many-to-many RBAC mapping.
- **Report** — the central entity: category, geolocation (lat/lng), status, reporter, optional assignee.
- **ReportPhoto** — photo attachments linked to a report (storage-provider agnostic).
- **ReportVerification** — a validator's decision on a report (one verification per validator per report).
- **ReportComment** — threaded comments on a report.
- **ReportStatusHistory** — an immutable log of every status transition.
- **AuditLog** — a generic action log (who did what, to which entity, when).

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

Every transition is recorded in `report_status_history`, and status-changing actions write to `audit_logs`. Assignment and status updates use `updateMany` guarded by the expected current state, preventing race conditions from two staff members acting on the same report simultaneously.

## Roles & Permissions

Four roles, seeded with a granular permission set (`server/prisma/seed.ts`):

| Role | Responsibilities |
|---|---|
| `RESIDENT` | Submit reports, view own reports and their history, comment, browse the public feed of verified reports |
| `VALIDATOR` | Review the verification queue, claim reports, confirm/reject/mark duplicate |
| `BARANGAY_STAFF` | Work the queue of verified reports, assign to self, progress and resolve |
| `ADMIN` | Manage users (roles/status), view audit logs, holds every permission |

Permissions are checked at request time via `requirePermission("permission:name")`, resolved from the authenticated user's role on every request (see `requireAuth.middleware.ts`). This means changing a role's permissions in the database takes effect immediately — no code changes or redeploys required.

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
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MySQL database (local or hosted)

### Installation

```bash
cd server
npm install
```

### Setup

1. Create a `.env` file in `server/` (see [Environment Variables](#environment-variables)).
2. Run migrations:

   ```bash
   npx prisma migrate deploy
   ```

3. Seed roles, permissions, and a default admin account:

   ```bash
   npx prisma db seed
   ```

## Environment Variables

Create `server/.env` with the following:

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

> ⚠️ **`COOKIE_NAME` and `AUTH_COOKIE_NAME` must match** — login sets the cookie under `AUTH_COOKIE_NAME` (or its default), while `requireAuth` reads it back under `COOKIE_NAME`. Keep both set to the same value or authentication will silently fail.

> Change `SEED_ADMIN_PASSWORD` before seeding a production database, and always set a strong, unique `JWT_SECRET`.

## Database & Seeding

The seed script (`prisma/seed.ts`) is idempotent (uses `upsert`) and sets up:

- 4 roles: `RESIDENT`, `VALIDATOR`, `BARANGAY_STAFF`, `ADMIN`
- 18 granular permissions (report CRUD, verification, staff queue, comments, history, user/audit management)
- The full role → permission mapping described [above](#roles--permissions)
- A default `ADMIN` user (email/password from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`, or the built-in defaults)

Re-run seeding any time with:

```bash
npx prisma db seed
```

To inspect the schema visually:

```bash
npx prisma studio
```

## Running the Server

```bash
# Development (auto-restart on changes)
npm run dev

# Production build
npm run build
npm start
```

The API is mounted under `/api`. A health check is available at `GET /api/health`.

By default, CORS is configured to allow `http://localhost:5173` (a Vite frontend) with credentials enabled — update `server/src/app.ts` if your frontend runs elsewhere.

## Testing

```bash
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

Common codes include `VALIDATION_ERROR` (400), `AUTH_REQUIRED` / `AUTH_MISSING_TOKEN` / `AUTH_INVALID_TOKEN` (401), `AUTH_FORBIDDEN` / `AUTH_INACTIVE` / `REPORT_FORBIDDEN` (403), `REPORT_NOT_FOUND` (404), and conflict codes like `INVALID_STATUS_TRANSITION`, `REPORT_NOT_ASSIGNABLE`, `REPORT_NOT_CLAIMABLE` (409).

## Security Notes

- Passwords are hashed with bcrypt (configurable salt rounds) and never returned in any response.
- Sessions use an HTTP-only, `SameSite`-aware cookie carrying a signed JWT — not accessible to client-side JS.
- `helmet` sets standard security headers; `express-rate-limit` throttles all `/api` traffic.
- Every request body/query/params is strictly validated with Zod (`.strict()` schemas reject unknown fields).
- State-changing operations (assignment, status updates) use conditional `updateMany` guards inside a transaction to prevent race conditions between concurrent staff/validators.
- Deactivating a user (`status: INACTIVE`) immediately blocks further access via `requireActiveAccount`, without needing to revoke the existing token.

## Roadmap

- Frontend client (in progress)
- Photo upload endpoint wiring for `ReportPhoto` (schema and relations are already in place)
- Map-based report clustering/visualization on the feed
