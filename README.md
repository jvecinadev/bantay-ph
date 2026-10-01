# Bantay PH

**Bantay PH** ("bantay" means watch or guard in Filipino) is a full-stack community issue-reporting platform for barangay-level governance. Residents report local problems like potholes, flooding, garbage, and broken streetlights, and each report moves through a verification and resolution pipeline handled by validators and barangay staff. Every action is logged, so there is always a clear record of who did what and when.

```
bantay-ph/
├── server/   # Node.js, Express, Prisma, MySQL API
└── client/   # React, TypeScript, Tailwind, TanStack Query frontend
```

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Report Lifecycle](#report-lifecycle)
- [Roles and Permissions](#roles-and-permissions)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [API Reference](#api-reference)
- [Error Format](#error-format)
- [Security Notes](#security-notes)
- [Struggles and Trade-offs](#struggles-and-trade-offs)
- [Roadmap](#roadmap)

---

## Overview

A resident submits a report with a category, description, photos, and a location picked on a map. A **validator** claims it from the verification queue and decides whether to confirm it, reject it, or mark it a duplicate of an existing report. Once confirmed, it lands in the **barangay staff** queue, where staff assign it to themselves, work on it, and eventually mark it resolved. Every status change is written to a history table, and the bigger actions also get logged in a separate audit trail.

On top of the reporting workflow, users now have their own profile (avatar, barangay, location details), personal settings (theme, notification preferences, privacy), and a dashboard tailored to their role. Staff see a workload-focused dashboard, admins see a platform-wide one.

Access to every endpoint is controlled by a role-to-permission system stored in the database rather than hardcoded in the route files, so permissions can be adjusted without touching code or redeploying anything.

## Tech Stack

**Backend**

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express 5 |
| Database | MySQL |
| ORM | Prisma |
| Auth | JWT in an HTTP-only cookie, bcrypt for passwords |
| Validation | Zod |
| File storage | Cloudinary (report photos, avatars) |
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

The backend follows a modular, layered structure. Each domain module, auth, reports, verifications, admin, users, dashboard, is self-contained, with its own routes, controller, service, and validation files.

```
Request → Route → Middleware (auth / permission / validation) → Controller → Service → Prisma → MySQL
```

- **Routes** just wire HTTP verbs and paths to middleware and controllers. No business logic lives here.
- **Controllers** stay thin. They pull validated input off `res.locals.validated`, call a service, and shape the response.
- **Services** hold all the actual business logic and Prisma queries, including the transactional writes where a status change, a history row, and an audit log entry all need to succeed or fail together.
- **Validation** (Zod) parses and strictly types the body, params, and query before a request ever reaches a controller.
- **Middleware** handles authentication, account status, and fine-grained permission checks as separate, composable pieces, so each route only picks up what it actually needs.

### Frontend

The frontend is organized by feature rather than by file type. `features/reports`, `features/verifications`, `features/staff`, `features/admin`, `features/users`, `features/dashboard`, and `features/auth` each bundle their own API calls, query hooks, components, and types.

- **`lib/api/http.ts`** is a single Axios instance with `withCredentials: true` (required for the cookie-based session), plus a response interceptor that normalizes every backend error into one consistent `ApiError` shape before it reaches a component.
- **`stores/authStore.ts`** (Zustand) holds the current user, their permissions array, and a `bootstrapped` flag so route guards never flash a logged-out state while the initial `GET /me` check is still in flight.
- **Route guards** (`RequireAuth`, `RequirePermissions`, `RedirectIfAuthed`) compose together in the router, mirroring the backend's own `requireAuth` and `requirePermission` split, so the mental model stays the same on both sides of the API boundary.
- **TanStack Query** owns all server state, reports, queues, users, dashboards, audit logs, so there's no duplication of server data into Zustand. Cache invalidation after a mutation stays simple and predictable.
- **React-Leaflet** powers the location picker when submitting a report, storing plain latitude/longitude decimals instead of anything provider-specific.

## Database Schema

MySQL via Prisma. `server/prisma/schema.prisma` is the source of truth, and the migration history (four migrations so far) tells its own story about how the schema grew.

### Entity relationship overview

```
Role ──< RolePermission >── Permission
  │
  │ 1
  ▼ *
User ──< Report (as reporter) >── User (as assignee, optional)
  │  │          │
  │  │          ├──< ReportPhoto
  │  │          ├──< ReportVerification >── User (as validator)
  │  │          ├──< ReportComment      >── User
  │  │          └──< ReportStatusHistory >── User (as author)
  │  │
  │  └──< AuditLog
  │
  ├── UserProfile (1:1)
  └── UserSettings (1:1)
```

### Table by table

**`roles`** / **`permissions`** / **`role_permissions`**
A standard many-to-many RBAC join. `role_permissions` uses a composite primary key (`@@id([roleId, permissionId])`) with cascading deletes on both sides, so removing a role or a permission cleans up its mappings automatically instead of leaving orphaned rows. Permissions are resolved at request time from a user's role rather than baked into the JWT, which means revoking a permission takes effect on the user's very next request instead of waiting for their token to expire.

**`users`**
- `id` is a UUID, not an auto-increment integer. This was a deliberate choice so IDs are never guessable and stay stable even if this data is ever merged with another system.
- `status` (ACTIVE or INACTIVE) acts as a soft-disable flag, checked on every authenticated request. Deactivating someone blocks them immediately without having to revoke or blacklist a token that's already out there.
- `passwordHash` never leaves the service layer. No query outside the auth module selects it.
- Now has two optional one-to-one relations: `UserProfile` and `UserSettings`.

**`user_profiles`** (new)
Holds an avatar (stored on Cloudinary, with `avatarProvider` and `avatarProviderFileId` kept alongside the URL so the file can be managed or deleted later), plain-text location fields (barangay, city or municipality, province, postal code), and a `privatePayload` column for anything sensitive that shouldn't be queryable or searchable. Indexed on `barangay` and `cityMunicipality` since those are the fields most likely to get filtered on later, for example, if reports ever get grouped by neighborhood.

**`user_settings`** (new)
A single `payload` column storing an AES-256-GCM encrypted JSON blob (theme preference, notification toggles, privacy settings). The app reads and writes through `encryptJson` / `decryptJson` helpers rather than storing these as plain columns. See [Security Notes](#security-notes) for why.

**`reports`**, the central table
- `category` and `status` are Prisma or MySQL enums, not free-text columns, so an invalid value gets rejected at the database level, not just by app validation.
- `latitude` and `longitude` are `Decimal(10,7)`, not `Float`. Floating point columns can quietly drift from rounding error across repeated writes, which matters a lot when that coordinate is what a crew uses to find the actual pothole.
- `assignedToId` is nullable with `onDelete: SetNull`. If a staff account is ever deleted, the report survives and just goes back to unassigned.
- `reporterId` uses `onDelete: Restrict`, so a user with existing reports can't be hard-deleted, only deactivated. This protects the historical record and the audit trail from quietly losing its origin.
- Now also has soft-delete columns: `deletedAt`, `deletedById`, `deletedReason`. A resident can delete their own report, but the row stays in the database with a timestamp, who deleted it, and (optionally) why, instead of disappearing outright.
- Indexed on `status`, `reporterId`, and `assignedToId`, which are exactly the columns every queue or list endpoint filters on. There are also composite indexes on `status + deletedAt` and `reporterId + deletedAt` so the soft-delete filtering doesn't slow those same queries down as the table grows.

**`report_verifications`**
- `@@unique([reportId, validatorId])` stops a single validator from submitting two decisions on the same report. This is enforced by the database itself, not just application logic, so it holds up even under concurrent requests.
- `validatorId` also uses `onDelete: Restrict`, for the same reason as `reporterId`: a verification decision is a historical fact and shouldn't vanish if the validator's account is later removed.

**`report_comments`**
A flat, non-threaded comment log per report, indexed on `reportId` and `userId`.

**`report_status_history`**
`oldStatus` is nullable since the very first row (REPORTED) has no prior status, while `newStatus` is always required. Nothing in the service layer ever updates or deletes a row here, it's meant to be append-only, independent of the `reports.status` column, which only ever holds the current state.

**`audit_logs`**
A generic, entity-agnostic action log. `entityId` is a plain string rather than a foreign key, which was deliberate, so the same table can log actions against reports, users, or anything else added later without a migration.

**`report_photos`**
Storage-provider agnostic by design, it stores a `url` plus optional `provider` and `providerFileId` fields rather than assuming any specific backend. This table was actually added in a separate migration after the initial schema, and the upload endpoint only got wired up later with Cloudinary, see [Struggles and Trade-offs](#struggles-and-trade-offs) for how that played out.

### Why Prisma and MySQL

Prisma gives compile-time-checked queries and makes relational includes easy to write (`report.findMany({ include: { reporter: true, verifications: true } })`), while migrations stay as plain, reviewable SQL in version control. MySQL made more sense than a document store here because the domain is genuinely relational: reports, users, roles, permissions, and their history all reference each other by foreign key, and several constraints (one verification per validator per report, specific cascade behavior on delete) are exactly the kind of thing a relational database can guarantee without extra application code.

## Report Lifecycle

Reports move through a strict, enforced state machine. Invalid transitions get rejected with a 409.

```
REPORTED ──► UNDER_VERIFICATION ──► VERIFIED ──► ASSIGNED ──► IN_PROGRESS ──► RESOLVED
    │                │
    └──► REJECTED    ├──► REJECTED
                      └──► DUPLICATE
```

| Stage | Trigger | Who |
|---|---|---|
| REPORTED | Resident submits a report | Resident |
| UNDER_VERIFICATION | Validator claims it from the queue | Validator |
| VERIFIED / REJECTED / DUPLICATE | Validator records a decision | Validator |
| ASSIGNED | Staff assigns a verified report to themselves | Barangay Staff |
| IN_PROGRESS | Staff starts work | Barangay Staff (assignee only) |
| RESOLVED | Staff finishes the fix | Barangay Staff (assignee only) |

Every transition gets written to `report_status_history`, and status-changing actions also write to `audit_logs`. Assignment and status updates use `updateMany` guarded by the expected current status, inside a transaction, so two staff members can't accidentally grab the same report at the same time.

## Roles and Permissions

Four roles, seeded with a granular permission set in `server/prisma/seed.ts`:

| Role | Responsibilities |
|---|---|
| RESIDENT | Submit reports, view their own reports and history, comment, browse the public feed |
| VALIDATOR | Review the verification queue, claim reports, confirm, reject, or mark as duplicate |
| BARANGAY_STAFF | Work the queue of verified reports, assign to self, progress and resolve |
| ADMIN | Manage users, view audit logs and dashboards, holds every permission |

Permissions are checked at request time with `requirePermission("permission:name")` on the backend, and mirrored on the frontend with `RequirePermissions` route guards and `useAuthStore().hasAnyPermission()`. Both sides read the same permission array returned from `GET /api/users/me`, so UI gating and API enforcement can't drift apart.

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── modules/
│   │   ├── auth/           # register, login, logout
│   │   ├── users/           # profile, avatar, settings, public profile
│   │   ├── reports/          # create, list, feed, photos, soft delete, staff queue, status
│   │   ├── verifications/     # verification queue, claim, verify
│   │   ├── admin/               # user management, audit logs
│   │   └── dashboard/            # staff and admin dashboard aggregations
│   ├── middleware/
│   │   ├── requireAuth.middleware.ts
│   │   ├── requireActive.middleware.ts
│   │   ├── requirePermission.middleware.ts
│   │   ├── validateRequest.middleware.ts
│   │   ├── uploadReportPhotos.middleware.ts
│   │   ├── uploadAvatar.middleware.ts
│   │   └── rateLimiter.middleware.ts
│   ├── common/
│   │   ├── auth/          # jwt, cookie, password hashing, token signing
│   │   ├── crypto/          # AES-256-GCM field encryption helpers
│   │   ├── errors/
│   │   └── utility/
│   ├── config/env.ts
│   ├── db/prisma.ts
│   ├── app.ts
│   ├── server.ts
│   └── routes.ts
└── tests/
    ├── auth.test.ts
    ├── rbac.test.ts
    └── workflow.test.ts

client/
├── src/
│   ├── app/
│   │   ├── layout/
│   │   ├── providers/
│   │   └── router/
│   ├── features/
│   │   ├── auth/
│   │   ├── users/              # profile, avatar, settings
│   │   ├── reports/
│   │   ├── verifications/
│   │   ├── staff/
│   │   ├── admin/
│   │   └── dashboard/           # admin + staff dashboards
│   ├── pages/
│   ├── shared/ui/
│   ├── stores/authStore.ts
│   └── lib/api/http.ts
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MySQL database (local or hosted)
- A Cloudinary account (free tier is fine) for photo and avatar uploads

### Installation

```bash
# Backend
cd server
npm install

# Frontend, separate terminal
cd client
npm install
```

### Setup

1. Create a `.env` file in `server/` (see [Environment Variables](#environment-variables) below).
2. Run the migrations:

   ```bash
   cd server
   npx prisma migrate deploy
   ```

3. Seed roles, permissions, and a default admin account:

   ```bash
   npx prisma db seed
   ```

4. Optionally, create a `.env` in `client/` with `VITE_API_URL=http://localhost:5000/api` if your API isn't running on the default host and port.

## Environment Variables

### `server/.env`

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | yes | MySQL connection string, e.g. `mysql://user:pass@localhost:3306/bantay_ph` |
| `PORT` | no | Port the server listens on (defaults to 5000) |
| `JWT_SECRET` | yes | Secret used to sign and verify auth JWTs |
| `JWT_EXPIRES_IN` | no | Token lifetime, e.g. `1d` (defaults to `1d`) |
| `COOKIE_NAME` | yes | Name of the cookie `requireAuth` reads the JWT from |
| `AUTH_COOKIE_NAME` | no | Name of the cookie set on login (defaults to `access_token`) |
| `AUTH_COOKIE_DOMAIN` | no | Cookie domain, if needed |
| `AUTH_COOKIE_MAX_AGE_MS` | no | Cookie max age in milliseconds |
| `AUTH_COOKIE_SAMESITE` | no | `lax`, `strict`, or `none` (defaults to `none` in production, `lax` otherwise) |
| `AUTH_COOKIE_SECURE` | no | `true` or `false` (defaults to `true` in production) |
| `BCRYPT_SALT_ROUNDS` | no | Salt rounds for password hashing, 8 to 15 (defaults to 10) |
| `FIELD_ENCRYPTION_KEY` | yes | Base64-encoded 32-byte key used to encrypt user settings and private profile data |
| `CLOUDINARY_CLOUD_NAME` | yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | yes | Cloudinary API secret |
| `CLIENT_URL` | yes | Frontend origin, added to the CORS allow-list alongside `http://localhost:5173` |
| `SEED_ADMIN_EMAIL` | no | Email for the seeded admin account (defaults to `admin@bantay.ph`) |
| `SEED_ADMIN_PASSWORD` | no | Password for the seeded admin account (defaults to `Admin12345!`) |
| `NODE_ENV` | no | `development`, `production`, or `test` |

> **Heads up about the cookie name.** `COOKIE_NAME` and `AUTH_COOKIE_NAME` are two separate variables that need to match. Login sets the cookie under `AUTH_COOKIE_NAME` (or its default), while `requireAuth` reads it back under `COOKIE_NAME`. If they don't match, login will return 200 like everything worked, but every request after that will 401, which is a confusing thing to debug the first time it happens. Set both to the same value.

> You'll want to change `SEED_ADMIN_PASSWORD` before seeding anything resembling production, and always use a strong, unique `JWT_SECRET`. For `FIELD_ENCRYPTION_KEY`, generate a real 32-byte key rather than typing something in by hand, for example with `openssl rand -base64 32`.

### `client/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | no | Base URL of the API (defaults to `http://localhost:5000/api`) |

## Running the App

```bash
# Backend, from server/
npm run dev        # dev server with auto-restart
npm run build && npm start   # production

# Frontend, from client/
npm run dev         # Vite dev server, default http://localhost:5173
npm run build        # production build
```

The API is mounted under `/api`, and there's a health check at `GET /api/health`. CORS is configured to allow `http://localhost:5173` plus whatever `CLIENT_URL` is set to, with credentials enabled.

## Testing

```bash
cd server
npm test
```

Tests run against a dedicated test database (via `NODE_ENV=test`) using Jest and Supertest, and cover:

- **`auth.test.ts`**, registration and login flows
- **`rbac.test.ts`**, role-based access control enforcement
- **`workflow.test.ts`**, the full report lifecycle, end to end

## API Reference

All routes sit under `/api`. Endpoints marked 🔒 require authentication (a valid session cookie) and an ACTIVE account, and the required permission is noted where there is one.

### Health

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check |

### Auth, `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | – | Register a new resident account |
| POST | `/login` | – | Log in, sets the auth cookie |
| POST | `/logout` | 🔒 | Clear the auth cookie |

### Users, `/api/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/me` | 🔒 | Current user, role, permissions, profile, and settings |
| PATCH | `/me/profile` | 🔒 | Update barangay, city, province, and other profile fields |
| POST | `/me/avatar` | 🔒 | Upload or replace avatar (Cloudinary) |
| GET | `/me/settings` | 🔒 | Get decrypted user settings (theme, notifications, privacy) |
| PATCH | `/me/settings` | 🔒 | Update settings, merged and re-encrypted |
| GET | `/:id/public` | 🔒 | Public-facing profile for another user |

### Reports, `/api/reports`

| Method | Path | Permission | Description |
|---|---|---|---|
| POST | `/` | `report:create` | Submit a new report |
| GET | `/mine` | `report:read:own` | List the current user's reports, paginated, filterable by category and status |
| GET | `/feed` | `report:feed:read` | Browse publicly visible reports (verified and beyond), paginated |
| GET | `/:id` | 🔒 | Get a single report by id |
| POST | `/:id/photos` | `report:create` | Upload one or more photos to a report (Cloudinary) |
| DELETE | `/:id` | 🔒 | Soft delete the reporter's own report |
| GET | `/staff/queue` | `report:staff_queue:read` | Verified, unassigned reports awaiting staff pickup |
| POST | `/:id/assign` | `report:assign` | Assign a verified report to yourself |
| PATCH | `/:id/status` | `report:update_status` | Move an assigned report to IN_PROGRESS or RESOLVED (assignee only) |
| POST | `/:id/comments` | `report:comment` | Add a comment to a report |
| GET | `/:id/comments` | 🔒 | List a report's comments |
| GET | `/:id/history` | 🔒 | List a report's status change history |

### Verifications, `/api/verifications`

| Method | Path | Permission | Description |
|---|---|---|---|
| GET | `/queue` | `verification:queue:read` | Reports awaiting verification |
| POST | `/:id/claim` | `report:claim_verification` | Claim a report for review |
| POST | `/:id/verify` | `report:verify` | Record a decision: CONFIRMED, REJECTED, or DUPLICATE |

### Dashboard, `/api/dashboard`

| Method | Path | Permission | Description |
|---|---|---|---|
| GET | `/staff` | `report:staff_queue:read` | Workload-focused stats for the signed-in staff member |
| GET | `/admin` | `audit:read` | Platform-wide stats for admins |

### Admin, `/api/admin`

| Method | Path | Permission | Description |
|---|---|---|---|
| GET | `/users` | `user:read` | List users, filterable by search term, role, status |
| PATCH | `/users/:id/role` | `user:update_role` | Change a user's role |
| PATCH | `/users/:id/status` | `user:update_status` | Activate or deactivate a user |
| GET | `/audit-logs` | `audit:read` | List audit log entries |

List endpoints generally share the same pagination shape: `?page=1&limit=10`, returning `{ page, limit, total, totalPages, ... }`.

## Error Format

Errors come back as JSON in a consistent shape:

```json
{
  "message": "Human-readable message",
  "code": "MACHINE_READABLE_CODE",
  "details": { }
}
```

Common codes include `VALIDATION_ERROR` (400), `AUTH_MISSING_TOKEN` / `AUTH_USER_NOT_FOUND` (401), `AUTH_FORBIDDEN` / `AUTH_INACTIVE` / `REPORT_FORBIDDEN` (403), `REPORT_NOT_FOUND` (404), and conflict codes like `INVALID_STATUS_TRANSITION`, `REPORT_NOT_ASSIGNABLE`, and `REPORT_NOT_CLAIMABLE` (409). The frontend's Axios interceptor normalizes all of this into one `ApiError` shape before it reaches a component, so UI error handling never has to branch on Axios internals.

## Security Notes

- Passwords are hashed with bcrypt and never returned in any response.
- Sessions use an HTTP-only, SameSite-aware cookie carrying a signed JWT, not accessible from client-side JS. The frontend never touches the token directly, `withCredentials: true` handles it.
- User settings and the private part of a user's profile are encrypted at rest with AES-256-GCM before being written to the database, using a dedicated `FIELD_ENCRYPTION_KEY`. Even with direct database access, that data isn't readable without the key.
- `helmet` sets standard security headers, and `express-rate-limit` throttles all `/api` traffic.
- Every request body, query, and param is strictly validated with Zod, and schemas reject unknown fields.
- State-changing operations like assignment and status updates use conditional `updateMany` guards inside a transaction to prevent race conditions between concurrent staff or validators.
- Deactivating a user blocks further access immediately through `requireActiveAccount`, without needing to revoke the token they already have.
- Reports are soft-deleted, not hard-deleted, so there's still a record of what was removed, by whom, and (when provided) why.
- Route protection happens twice, independently: server-side via `requireAuth` and `requirePermission` (the actual boundary), and client-side via `RequireAuth` and `RequirePermissions` (a UX nicety so the user never sees a page they can't act on, never treated as a real security control).

## Struggles and Trade-offs

Some honest notes on decisions that weren't obvious going in, and what I'd reconsider.

- **The cookie name split (`COOKIE_NAME` vs `AUTH_COOKIE_NAME`) is still there.** I noticed this a while back and haven't collapsed it into a single variable yet, mostly because doing so now means touching a value an already-seeded deployment depends on. For now it's just documented clearly above so it doesn't eat an hour of someone's time the first time they set this up.
- **Permissions get resolved per request instead of being baked into the JWT.** A smaller token with permissions embedded would be a faster check, but a permission change wouldn't take effect until the token expired or the user logged back in. Paying for one extra query per authenticated request felt worth it here, since deactivating or re-permissioning a user needs to actually work right away in a moderation-heavy app like this.
- **`report_photos` was bolted on after the fact, and the upload endpoint took even longer.** The original schema shipped with no photo support at all. The table arrived in a second migration, and the actual upload route, through Multer, Cloudinary, and streamifier, only showed up later still. In hindsight it would've been better to design this in from day one. Keeping the table provider-agnostic (storing `url` plus optional `provider` and `providerFileId`) at least meant switching storage backends later wouldn't require another migration.
- **Decimal instead of Float for coordinates.** This one came out of a schema review, not the first draft. Float columns can drift slightly over repeated reads and writes, which is a real problem when that number is what sends a crew to a physical location. Switching to `Decimal(10,7)` costs a bit of storage and means the frontend has to explicitly handle it as a string or Decimal-like value instead of a plain number, but it's worth the extra care.
- **Restrict vs cascade vs set-null, chosen relation by relation rather than globally.** `reporterId` and `validatorId` use `Restrict`, so a user with existing reports or verifications can't be hard-deleted, only deactivated. `assignedToId` uses `SetNull`, so a report survives even if its assignee is removed. Photos, comments, verifications, and history all cascade with their parent report. Getting this consistent took a second pass through the schema. The rule that eventually stuck was simple: anything that represents a historical decision gets protected, anything that's just current-state metadata is allowed to degrade gracefully.
- **Application-level encryption for settings and private profile data, added later rather than from the start.** Once user profiles and settings existed as real features, it became obvious that some of that data (privacy preferences, anything in the private payload) shouldn't just sit in plain text even behind normal access controls. Adding AES-256-GCM encryption after the fact meant going back and updating the read and write paths for those two tables rather than designing around it from the beginning, which took more care than if it had been part of the original plan.
- **Client-side route guards exist purely for UX, not security.** Since permissions are already enforced server-side on every request, `RequireAuth` and `RequirePermissions` on the frontend just stop a user from seeing a page they can't act on in the first place. It would've been simpler to skip them entirely and let failed API calls surface a 403, but that produces a worse experience, a flash of content followed by an error, for very little implementation effort saved.
- **No refresh-token rotation yet.** Sessions still rely on a single JWT with a fixed expiry rather than an access and refresh token pair. It's simpler to reason about and has been fine for the current scope, but it's a real trade-off: a longer expiry is more convenient but widens the exposure window if a cookie were ever compromised, and a shorter one means more frequent forced logins. This is probably the next meaningful security improvement to make.

## Roadmap

- Refresh-token rotation instead of a single long-lived JWT
- Map-based clustering or visualization on the public feed
- Deployed demo plus a Postman or OpenAPI collection
- Notifications (email or in-app) tied into the settings a user already has control over
