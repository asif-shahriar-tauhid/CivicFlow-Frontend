# CivicFlow Frontend

CivicFlow is a citizen-first municipal service intake and grievance resolution platform. It connects residents with municipal departments through geo-tagged issue reporting, photographic evidence, transparent status tracking, service-level agreement (SLA) monitoring, and citizen-verified resolution.

This repository contains the web frontend for CivicFlow. It provides responsive public, citizen, department staff, and municipal administrator experiences and communicates with the CivicFlow REST API.

## Contents

- [Product Overview](#product-overview)
- [Implemented Capabilities](#implemented-capabilities)
- [User Roles](#user-roles)
- [Application Routes](#application-routes)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Backend Integration](#backend-integration)
- [Authentication](#authentication)
- [Request Lifecycle](#request-lifecycle)
- [Payments](#payments)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Validation and Production Build](#validation-and-production-build)
- [Accessibility and Design](#accessibility-and-design)
- [Demo Accounts](#demo-accounts)
- [Implementation Status](#implementation-status)
- [Troubleshooting](#troubleshooting)

## Product Overview

CivicFlow is designed for urban residents who need to report problems such as waste accumulation, broken street lighting, road hazards, water logging, and other municipal service failures.

A report can include a description, category, address, ward or zone, landmark, GPS coordinates, and up to five photographic attachments. After submission, the citizen can follow the case from intake through resolution and confirm whether the work was completed. If the issue persists, the citizen can reopen the case within the seven-day reopening window.

The platform is built around four principles:

1. **Zero-friction intake:** reporting an issue should be fast and usable from a mobile browser in the field.
2. **Radical transparency:** the responsible department, current state, SLA expectation, and case history remain visible.
3. **Ground-truth verification:** location metadata and photographic evidence support both the report and the resolution.
4. **Accessible public service:** controls are keyboard navigable, touch-friendly, and designed for high-contrast outdoor reading.

## Implemented Capabilities

The current frontend covers the complete tracked product surface, including 64 implemented frontend/backend workflows.

### Public experience

- Municipal public homepage with reporting call to action
- Live public telemetry and service statistics
- Anonymous quick tracking by request number
- Service category overview
- Civic charter, SLA policy, and reopening policy page
- Authentication, registration, email verification, password recovery, and reset flows
- Google OAuth sign-in
- Unauthorized access and not-found recovery pages

### Citizen portal

- Citizen dashboard with request list, filters, statuses, and SLA countdowns
- 60-second incident and grievance intake wizard
- Dynamic service category selection
- Browser geolocation capture and location details
- Multi-photo upload with evidence preview
- Request dossier with status timeline, notes, evidence gallery, and metadata
- Editing and deletion of eligible submitted requests
- Resolution confirmation
- Seven-day case reopening with a reason
- Five-star feedback and comments for closed requests
- bKash payment initiation and payment status polling
- Payment history, payment details, and invoice receipts
- Profile image upload and profile settings
- Notifications with unread count and mark-as-read actions

### Department staff portal

- Personal work queue
- Department-wide queue
- Status and priority filtering
- SLA countdown and breach visibility
- Request action workbench
- Status transitions through the request state machine
- Investigation note submission
- Assignment context and GPS navigation links
- Request evidence and resolution history

### Municipal administrator portal

- Citywide incident triage overview
- Public and administrative analytics
- Request routing and re-routing
- Staff assignment and reassignment
- User directory with search, role, status, and department filters
- User role and status management
- Soft deletion and account blocking
- Department CRUD, archive, and restore
- Category routing rule management and simulation
- SLA overdue incident monitoring
- Category SLA configuration
- Manual SLA escalation
- SLA breach batch processing
- Immutable audit log inspection with before/after state details
- Citizen feedback reports
- Revenue and payment ledger

## User Roles

CivicFlow uses three fixed backend roles:

| Role      | Primary responsibilities                                                                          | Main frontend area |
| --------- | ------------------------------------------------------------------------------------------------- | ------------------ |
| `CITIZEN` | Submit and track personal requests, pay applicable fees, verify resolutions, and provide feedback | `/citizen`         |
| `STAFF`   | Work assigned or department-wide queues, update request state, and add investigation notes        | `/staff`           |
| `ADMIN`   | Govern users, departments, routing, SLAs, payments, audit logs, and citywide operations           | `/admin`           |

Role-aware route guards are applied through the dashboard layouts and the shared authentication provider. Unauthorized users are sent to `/unauthorized`.

## Application Routes

### Public and authentication routes

| Route              | Purpose                                                |
| ------------------ | ------------------------------------------------------ |
| `/`                | Public municipal portal homepage                       |
| `/about-us`        | Civic charter, SLA commitments, and policy information |
| `/login`           | Credential and Google sign-in                          |
| `/register`        | Citizen registration                                   |
| `/account-verify`  | Email verification                                     |
| `/forgot-password` | Start password recovery                                |
| `/reset-password`  | Set a new password                                     |
| `/unauthorized`    | Role and access restriction page                       |

### Citizen routes

| Route                           | Purpose                                     |
| ------------------------------- | ------------------------------------------- |
| `/citizen`                      | Citizen request dashboard                   |
| `/citizen/report`               | New request intake wizard                   |
| `/citizen/requests/[id]`        | Request dossier and resolution actions      |
| `/citizen/payments`             | Citizen payment history                     |
| `/citizen/payments/[paymentId]` | Payment receipt and invoice                 |
| `/citizen/payments/result`      | Payment gateway result and settlement state |

### Staff routes

| Route                  | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `/staff`               | Personal and department work queues        |
| `/staff/requests/[id]` | Field operations workbench for one request |

### Administrator routes

| Route                         | Purpose                                                   |
| ----------------------------- | --------------------------------------------------------- |
| `/admin`                      | Citywide triage and operational overview                  |
| `/admin/users`                | User and personnel directory                              |
| `/admin/departments`          | Department management and staff rosters                   |
| `/admin/routing-rules`        | Category-to-department routing rules                      |
| `/admin/sla`                  | SLA monitoring, configuration, escalation, and processing |
| `/admin/audit-logs`           | Audit trail inspection                                    |
| `/admin/feedback-reports`     | Citizen satisfaction reports                              |
| `/admin/payments`             | Revenue and payment ledger                                |
| `/admin/payments/[paymentId]` | Administrative payment receipt                            |
| `/admin/requests/[id]`        | Administrative request controls                           |

## Architecture

The frontend uses the Next.js App Router and is organized around route groups, shared providers, API modules, hooks, and reusable UI components.

### Request and data flow

1. A route renders a page or dashboard view.
2. The page uses a feature hook from `src/hooks`.
3. The hook uses a feature API function from `src/api`.
4. The API function calls the shared `src/lib/apiClient.ts` wrapper.
5. The client sends requests to the CivicFlow REST API with browser credentials included.
6. TanStack Query caches server state, coordinates refetching, and invalidates related data after mutations.
7. Providers expose authentication, query, Google OAuth, and notification/toast behavior to the application tree.

### API response shape

The backend uses a standardized response envelope:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Human-readable message",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

Validation errors use `success: false`, a status code, a message, and optional `errorSources` entries containing a field path and message. Feature API functions and hooks preserve this contract for page-level loading, error, and mutation states.

## Technology Stack

### Frontend

- Next.js `16.3.7` with the App Router
- React `19.2.8`
- TypeScript
- Tailwind CSS v4
- Base UI and shadcn component patterns
- TanStack Query for server-state management
- TanStack Form and Zod for form state and validation
- Framer Motion for focused interface transitions
- Lucide React for icons
- `ofetch` for API requests
- Biome for formatting and linting

### Backend services

The frontend integrates with a separate CivicFlow API built with Node.js and TypeScript, Express 5, Prisma 7, PostgreSQL, Redis, Cloudinary, Nodemailer, JWT authentication, bKash Tokenized Checkout, and Zod validation.

The backend repository is referred to in the project documentation as `B7A6-CivicFlowAPI`.

## Requirements

- Node.js compatible with the installed Next.js version
- Bun `1.4.2` is the repository package-manager version
- Access to a running CivicFlow backend for authenticated and data-driven flows
- A Google OAuth client ID if Google sign-in is being tested
- bKash and Cloudinary configuration on the backend for payment and uploaded media workflows

## Getting Started

### 1. Install dependencies

From the repository root:

```bash
bun install
```

The project can also be run with npm, but the repository declares Bun as its package manager. Keep the lockfile and package-manager choice consistent when adding dependencies.

### 2. Configure environment variables

Create a local `.env.local` file in the repository root. See [Environment Variables](#environment-variables) for the supported values.

For local full-stack development, the API normally runs at `http://localhost:5000` and the frontend at `http://localhost:3000`.

### 3. Start the development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

The equivalent npm command is:

```bash
npm run dev
```

### 4. Start the backend

Start the CivicFlow API separately using the backend repository's documented setup. The frontend expects the API prefix `/api/v1`; it does not provide a local API proxy or NextAuth session.

## Environment Variables

Only public browser-safe variables are read by this frontend:

| Variable                       | Required           | Description                                                                                                                     | Example                                                   |
| ------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`     | No                 | CivicFlow API origin or full API base. The client normalizes it to include `/api/v1`. If omitted, the deployed API URL is used. | `http://localhost:5000` or `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | For Google sign-in | Google OAuth client ID passed to `GoogleOAuthProvider`.                                                                         | `1234567890-example.apps.googleusercontent.com`           |

Example `.env.local`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

`NEXT_PUBLIC_` values are bundled into browser JavaScript. Do not place API secrets, JWT secrets, database credentials, Cloudinary secrets, SMTP passwords, or bKash private credentials in this frontend repository. Those belong in the backend environment.

## Backend Integration

The default API base is:

```text
https://civic-flow-api.vercel.app/api/v1
```

For local development, set `NEXT_PUBLIC_API_BASE_URL` to the backend origin or its `/api/v1` URL. The shared client removes trailing slashes and appends `/api/v1` when necessary, so both of these values are accepted:

```text
http://localhost:5000
http://localhost:5000/api/v1
```

The API client sends `credentials: "include"` on every request because the backend owns JWT session cookies. The backend must allow the frontend origin through CORS and must be configured for the expected cookie behavior.

The API prefix includes modules for authentication and users, service requests and attachments, departments and routing rules, payments and invoices, notifications, feedback, SLA monitoring and escalation, audit logs, and dashboard analytics.

## Authentication

CivicFlow authentication is backend-owned:

- Access and refresh JWTs are stored in HTTP-only cookies.
- The access cookie lasts one day and the refresh cookie lasts seven days in the standard backend configuration.
- Bearer authorization is also supported by the API, although the frontend primarily relies on cookies.
- The frontend calls the backend `auth/me` endpoint to hydrate the current user.
- Refresh behavior is handled through the backend refresh-token endpoint and cookies.
- The frontend does not use NextAuth.
- Authenticated views use `AuthProvider`, `RoleGuard`, and dashboard layouts to enforce access boundaries.

When authentication appears stuck during local development, verify that the frontend origin is allowed by backend CORS and that requests include credentials. Also verify that the API URL points to the backend rather than the frontend dev server.

## Request Lifecycle

Service requests move through the deterministic lifecycle below:

```text
SUBMITTED -> TRIAGED -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED
```

The platform also records routing state, priority, SLA due time, breach state, assignment history, investigation notes, status history, resolution information, and audit information.

The citizen-facing resolution loop is:

1. A citizen submits a request with evidence and location details.
2. The request is triaged and routed to a department.
3. Staff investigate the issue and record field notes.
4. Staff and administrators update the operational state.
5. An administrator records the resolution summary when the work is complete.
6. The citizen confirms the resolution and the request closes.
7. If the issue persists, the citizen can reopen it within seven days and provide a reason.

## Payments

Some request categories can require a fee. The frontend supports the bKash flow through the backend:

1. A citizen starts checkout from the request fee panel.
2. The backend initiates the bKash transaction.
3. bKash redirects through the backend callback flow.
4. The frontend displays the payment result.
5. The payment status is polled until settlement is known.
6. The citizen can view payment history and download or open the generated invoice.

Payment credentials and gateway configuration are backend concerns. Do not add them to `.env.local` for this frontend unless a future implementation explicitly requires a public, non-secret setting.

## Project Structure

```text
src/
├── api/                    Feature-specific REST API functions
├── app/                    Next.js App Router pages, layouts, and global CSS
│   ├── (dashboard)/        Citizen, staff, and admin authenticated areas
│   ├── (public)/           Marketing and authentication routes
│   └── unauthorized/       Access restriction page
├── asset/                  Logos, icons, and static UI assets
├── components/             Shared UI, forms, layouts, and feature modules
├── constants/              Shared constants and transition definitions
├── hooks/                  TanStack Query and feature hooks
├── lib/                    API client, utilities, auth, and payment helpers
├── providers/              Query, auth, Google, and provider composition
├── types/                  Shared TypeScript types
└── validation/             Zod schemas for client-side validation
```

Important files and directories:

- `src/lib/apiClient.ts`: shared `ofetch` client, API base normalization, and credentials configuration
- `src/providers/authProvider.tsx`: current-user hydration and logout state
- `src/providers/queryProvider.tsx`: TanStack Query configuration
- `src/components/layouts/dashboard/`: authenticated shell, navigation, notifications, and responsive dashboard layout
- `src/components/modules/`: feature-level UI for reporting, requests, payments, profile, home, and administration
- `src/validation/`: client-side Zod validation schemas
- `src/types/`: shared TypeScript types
- `src/app/globals.css`: design tokens and global styles
- `src/asset/svg/Logo.tsx`: CivicFlow brand mark

## Development Workflow

### Add or change an API-backed feature

1. Add or update the domain type in `src/types`.
2. Add the API function in the matching `src/api` module.
3. Add a TanStack Query hook in the matching `src/hooks` module.
4. Define or update Zod validation in `src/validation` when the feature accepts user input.
5. Build the page or feature component under the nearest route or `src/components/modules` directory.
6. Invalidate affected query keys after successful mutations.
7. Add loading, error, empty, success, and disabled states.
8. Check the feature at mobile and desktop widths.

### Keep API behavior predictable

- Use the shared `apiClient`; do not create ad hoc `fetch` wrappers for individual features.
- Preserve the backend response envelope and error information.
- Keep credentials enabled for every API call.
- Treat status transitions and role permissions as backend rules, not only UI rules.
- Prefer existing hooks, UI primitives, toast patterns, and design tokens before adding new abstractions.

## Validation and Production Build

Run the repository checks before opening a pull request:

```bash
bun run lint
bun run build
```

The available package scripts are:

| Command          | Purpose                              |
| ---------------- | ------------------------------------ |
| `bun run dev`    | Start the Next.js development server |
| `bun run build`  | Create a production build            |
| `bun run start`  | Serve the production build           |
| `bun run lint`   | Run Biome checks                     |
| `bun run format` | Format supported files with Biome    |

There is currently no dedicated automated test script in `package.json`. Feature verification should therefore include the relevant authenticated workflow against a running backend, plus lint and production-build checks.

## Accessibility and Design

CivicFlow follows the design guidance in `DESIGN.md`:

- WCAG AA contrast is the target for body copy and critical status indicators.
- Interactive targets should be at least 44 by 44 pixels on mobile.
- Forms expose visible validation and loading feedback.
- Controls are keyboard navigable and screen-reader friendly.
- Buttons, inputs, filters, and status badges use pill geometry.
- Cards, tables, dialogs, and structural containers use restrained architectural radii rather than pill corners.
- Case IDs, coordinates, timestamps, and SLA counters use tabular monospace treatment where appropriate.
- Surfaces use borders and tonal contrast instead of heavy resting shadows.
- Raster assets and citizen evidence should use modern WebP or AVIF formats where supported.

The brand uses a deep marine teal foundation with electric cyan and cobalt flow accents. Accent colors are intentionally used for actions, state changes, and telemetry rather than covering entire surfaces.

## Demo Accounts

The backend seed provides these development accounts:

| Role      | Email                          | Password       |
| --------- | ------------------------------ | -------------- |
| `ADMIN`   | `superadmin@example.com`       | `Password@123` |
| `STAFF`   | `staff.drainage@civicflow.org` | `Password@123` |
| `CITIZEN` | `citizen.sarah@example.com`    | `Password@123` |

Use seeded credentials only in a local or explicitly controlled development environment. Change or remove them before any production deployment.

## Implementation Status

The implementation tracker currently records:

| Area                            | Status                |
| ------------------------------- | --------------------- |
| Authentication and profile      | 10 of 10 complete     |
| Citizen portal and reporting    | 14 of 14 complete     |
| Payments and invoicing          | 7 of 7 complete       |
| Department staff field desk     | 10 of 10 complete     |
| Municipal administrator desk    | 16 of 16 complete     |
| Notifications and subscriptions | 3 of 3 complete       |
| Public and marketing surface    | 4 of 4 complete       |
| **Total**                       | **64 of 64 complete** |

The detailed endpoint-to-page mapping lives in `implementation_status_tracker.md`. Product intent is documented in `PRODUCT.md`, visual and interaction rules in `DESIGN.md`, and backend contracts in `backend_overview.md`.

## Troubleshooting

### API requests return network errors

Check that:

1. The backend is running.
2. `NEXT_PUBLIC_API_BASE_URL` points to the backend.
3. The URL includes the correct `/api/v1` prefix or can be normalized by the client.
4. The backend CORS origin includes `http://localhost:3000`.
5. Cookies are accepted for the current frontend and API origins.

### Google sign-in is unavailable

Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and ensure the current browser origin is registered in the Google Cloud OAuth client configuration. Credential-based login does not depend on this variable.

### Images do not render

The Next.js configuration allows remote images from `res.cloudinary.com`. Confirm that uploaded image URLs use that hostname or update `next.config.ts` deliberately when adding a trusted storage provider.

### A role cannot access a dashboard

Confirm that the signed-in account has the expected backend role and is not blocked, deleted, or inactive. Role access is enforced by the backend as well as by frontend guards.

### Build or lint output differs locally

Use the declared package manager and install dependencies from the lockfile. Check the active Node.js and Bun versions, then run `bun run lint` and `bun run build` from the repository root.

## Related Documentation

- [Product definition](PRODUCT.md)
- [Design system](DESIGN.md)
- [Backend integration overview](backend_overview.md)
- [Implementation tracker](implementation_status_tracker.md)
- [Next.js documentation](https://nextjs.org/docs)
