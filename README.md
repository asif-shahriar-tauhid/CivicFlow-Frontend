<div align="center">

<h1 align="center">
  <img src="./public/civicflow-logo.svg" alt="CivicFlow Logo" width="46" height="46" align="absmiddle" style="vertical-align: middle; margin-right: 12px;" />
  <span>CivicFlow</span>
</h1>

<p align="center">
  <strong>Next-Generation Municipal Service Intake, Department Dispatch & Deterministic SLA Governance Portal</strong>
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js_16.3-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript_5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://bun.sh/"><img src="https://img.shields.io/badge/Bun_1.4-fbf0df?style=for-the-badge&logo=bun&logoColor=black" alt="Bun" /></a>
  <a href="https://biomejs.dev/"><img src="https://img.shields.io/badge/Biome_2.4-60A5FA?style=for-the-badge&logo=biome&logoColor=white" alt="Biome" /></a>
  <a href="https://tanstack.com/query/latest"><img src="https://img.shields.io/badge/TanStack_Query_v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-100%25_Production_Ready-0D9488?style=flat-square&logo=checkmarx&logoColor=white" alt="Status" />
  <img src="https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-0284C7?style=flat-square&logo=w3c&logoColor=white" alt="WCAG AA" />
  <img src="https://img.shields.io/badge/Payments-bKash_Tokenized-E2136E?style=flat-square" alt="bKash" />
  <img src="https://img.shields.io/badge/Architecture-App_Router_SPA_Hybrid-8B5CF6?style=flat-square" alt="Architecture" />
  <img src="https://img.shields.io/badge/License-MIT-10B981?style=flat-square" alt="License" />
</p>

<p align="center">
  <a href="#-quick-links--project-snapshot"><strong>🌐 Quick Links</strong></a> &nbsp;•&nbsp;
  <a href="#-demo-accounts"><strong>🔑 1-Click Demo Accounts</strong></a> &nbsp;•&nbsp;
  <a href="#-system-architecture"><strong>🧭 Architecture</strong></a> &nbsp;•&nbsp;
  <a href="#-deterministic-state-machine"><strong>🔄 State Machine</strong></a> &nbsp;•&nbsp;
  <a href="#-application-routes"><strong>🗺️ Routes</strong></a> &nbsp;•&nbsp;
  <a href="#-getting-started"><strong>🚀 Getting Started</strong></a>
</p>

</div>

---

> **CivicFlow** is an enterprise-grade, citizen-first municipal service intake, grievance redressal, and SLA governance platform. It bridges the gap between urban residents and municipal field departments through high-precision geotagged reporting, photographic evidence capture, transparent operational tracking, SLA breach escalation, and citizen-verified resolution.
>
> This repository houses the frontend client built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**, communicating with the CivicFlow REST API.

---

## 🔗 Quick Links & Project Snapshot

### Development & API Endpoints

| Resource | Target URL | Protocol & Context |
| :--- | :--- | :--- |
| **Local Development Web App** | [`http://localhost:3000`](http://localhost:3000) | Next.js 16 App Router local client |
| **Local Backend REST API** | [`http://localhost:5000`](http://localhost:5000) | Express 5 gateway (`/api/v1`) |
| **Cloud Deployed Backend API** | [`https://civic-flow-api.vercel.app`](https://civic-flow-api.vercel.app) | Production REST endpoint |
| **Canonical API Prefix** | `/api/v1` | Versioned resource namespace |

### Target Personas & Core Journeys

| Persona | Clearance Badge | Primary Operational Experience |
| :--- | :---: | :--- |
| **Citizens** | `CITIZEN` | 60-second incident reporting, GPS geotagging, progress tracking, bKash fees, and 7-day resolution verification |
| **Department Staff** | `STAFF` | Department work queues, assigned tasks, field investigation notes, and active state transitions |
| **City Administrators** | `ADMIN` | Citywide triage command desk, department routing rules, personnel assignment, SLA configuration, payments, and audit ledger |

---

## 📚 Quick Navigation

<div align="center">

| Architecture & Portals | Operations & Setup | Standards & Audits |
| :--- | :--- | :--- |
| • [Product Overview](#-product-overview)<br>• [System Architecture](#-system-architecture)<br>• [Deterministic State Machine](#-deterministic-state-machine)<br>• [Implemented Portals](#-implemented-portals--features)<br>• [Application Routes](#-application-routes) | • [Technology Stack](#️-technology-stack)<br>• [Demo Accounts](#-demo-accounts)<br>• [Getting Started](#-getting-started)<br>• [Environment Variables](#️-environment-variables)<br>• [Authentication (Cookies)](#-backend-integration--authentication) | • [bKash Payments](#-municipal-payments-bkash)<br>• [Project Structure](#-project-structure)<br>• [Quality Assurance](#-quality-assurance--verification)<br>• [Accessibility Guide](#-accessibility--design-principles)<br>• [Implementation Audit](#-implementation-audit) |

</div>

---

## 🏡 Product Overview

CivicFlow addresses the chronic bottlenecks of municipal administration: lost paper grievances, opaque field progress, missed service deadlines, and unverified work completions.

A citizen can report municipal failures (e.g., waste overflow, defective street lamps, potholes, open drainage, waterlogging) in under 60 seconds with exact GPS coordinates and photographic proof. Once submitted, the ticket enters an automated triage and routing pipeline, visible to department crews and administrators. Upon completion, resolution is gated by citizen verification—with an unconditional 7-day reopening guarantee if work is deficient.

### Core Architectural Pillars

```
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│   Zero-Friction Intake  │  │   Radical Transparency  │  │  Ground-Truth Validation│  │  Resilient Public UI    │
│  60s report, 1-tap GPS, │  │ Public SLA countdowns,  │  │ Geo-coordinates, camera │  │ WCAG AA contrast,       │
│  client WebP compression│  │ immutable audit trails  │  │ before/after evidence   │  │ mobile slide-out drawer │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
```

1. **Zero-Friction Intake:** Reporting is optimized for field-ready mobile browsers with 1-tap geolocation capture and client-side WebP image optimization.
2. **Radical Transparency:** Assigned technician, SLA countdown timers, routing rationale, and immutable state audit trails are openly visible.
3. **Ground-Truth Verification:** Evidence photos and precise coordinates govern both the initial report and final resolution audit.
4. **Resilient Public Service:** High-contrast outdoor readability, strict WCAG AA color accessibility, full keyboard navigation, and optimistic UI updates.

---

## 🧭 System Architecture

CivicFlow is organized around client-side data orchestration powered by **TanStack Query v5**, custom feature API abstractions, and HTTP-only cookie-based authentication.

```mermaid
graph TD
    subgraph Browser ["Client Application (Next.js 16 App Router)"]
        UI["Page & Component Layer"]
        Hooks["Feature Hooks (src/hooks)"]
        QueryCache["TanStack Query Cache"]
        APIClient["API Client Wrapper (ofetch)"]
        RoleGuard["RoleGuard & AuthProvider"]
    end

    subgraph Backend ["CivicFlow REST API (/api/v1)"]
        Express["Express 5 Gateway"]
        AuthMiddleware["JWT Cookie Auth Middleware"]
        Controllers["Module Controllers"]
        Prisma["Prisma ORM (PostgreSQL)"]
        Redis["Redis Cache & Rate Limiting"]
        Cloudinary["Cloudinary Storage"]
        bKash["bKash Tokenized Gateway"]
    end

    UI --> Hooks
    Hooks --> QueryCache
    Hooks --> APIClient
    APIClient -- "credentials: 'include'" --> Express
    RoleGuard -- "hydrates session via /auth/me" --> APIClient
    Express --> AuthMiddleware
    AuthMiddleware --> Controllers
    Controllers --> Prisma
    Controllers --> Redis
    Controllers --> Cloudinary
    Controllers --> bKash
```

### Data Flow & Cache Lifecycle

1. **Route Mount:** Pages hydrate server-cached or freshly requested data through declarative hooks (e.g., `useGetServiceRequestById`, `useGetNotifications`).
2. **Unified Transport:** Requests are piped through `src/lib/apiClient.ts`, which automatically normalizes base URLs, handles JSON payloads, and attaches browser credentials (`credentials: "include"`).
3. **Envelope Parsing:** API responses conform to the standard CivicFlow contract:
   ```json
   {
     "success": true,
     "statusCode": 200,
     "message": "Operation executed successfully",
     "data": {},
     "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
   }
   ```
4. **Optimistic Mutations:** State changes (e.g., mark notification read, status transitions) update the local cache optimistically and trigger targeted query invalidation on settlement.

---

## 🔄 Deterministic State Machine

CivicFlow tickets strictly follow the municipal state machine defined in the backend core service:

```mermaid
stateDiagram-v2
    [*] --> SUBMITTED : Citizen Reports Grievance
    SUBMITTED --> TRIAGED : Categorized & SLA Seeded
    SUBMITTED --> REJECTED : Out of Jurisdiction / Duplicate

    TRIAGED --> ASSIGNED : Routed to Department / Field Technician
    TRIAGED --> REJECTED : Invalid Claim

    ASSIGNED --> IN_PROGRESS : Technician On-Site / Investigation
    ASSIGNED --> REJECTED : Unresolvable

    IN_PROGRESS --> RESOLVED : Administrative Resolution Statement

    RESOLVED --> CLOSED : Citizen Confirms Resolution
    RESOLVED --> IN_PROGRESS : Citizen Reopens (Within 7-Day Window)

    CLOSED --> IN_PROGRESS : Citizen Reopens (Within 7-Day Window)
    CLOSED --> [*] : Terminal Archival
    REJECTED --> [*] : Terminal Archival
```

### State Definitions

| State | Operational Meaning | Permitted Actors | Next Eligible States |
| :--- | :--- | :---: | :--- |
| `SUBMITTED` | Grievance received into public intake pool; awaiting review. | Citizen | `TRIAGED`, `REJECTED` |
| `TRIAGED` | Priority classified, SLA timer started, and target department identified. | Admin | `ASSIGNED`, `REJECTED` |
| `ASSIGNED` | Assigned to a specific field technician or department work roster. | Admin, Staff | `IN_PROGRESS`, `REJECTED` |
| `IN_PROGRESS` | Active field investigation, repairs, or sanitation works underway. | Staff, Admin | `RESOLVED` |
| `RESOLVED` | Municipal work complete; awaiting citizen verification. | Admin | `CLOSED`, `IN_PROGRESS` (Reopen) |
| `CLOSED` | Resolution verified by citizen or automatically sealed. | Citizen | `IN_PROGRESS` (Within 7 days) |
| `REJECTED` | Deemed invalid, duplicate, or outside municipal jurisdiction with justification. | Admin | Terminal Archival |

> [!NOTE]
> Resolving a grievance (`IN_PROGRESS` &rarr; `RESOLVED`) represents an executive municipal decision strictly restricted to municipal administrators (`ADMIN`). Field technicians record investigation notes and report findings.

---

## ✨ Implemented Portals & Features

The frontend covers all **64 tracked product workflows** across 4 key roles:

### 1. 🌐 Public & Marketing Portal

- **Municipal Homepage:** Hero banner, live operational telemetry, trust guarantees, and intake calls to action.
- **Anonymous Tracking:** Quick grievance lookup by public Tracking Number (`REQ-YYYY-XXXXX`) without login.
- **Civic Charter:** Public SLA commitments, category-wise resolution benchmarks, and reopening rights.
- **Authentication Flows:** Registration with validation, email OTP verification, credential login with demo quick-fill, Google OAuth sign-in, and password recovery/reset.

### 2. 👥 Citizen Portal (`/citizen`)

- **Dashboard Overview:** Metric KPI chips, active ticket feeds, priority indicators, and SLA breach countdowns.
- **60-Second Intake Wizard (`/citizen/report`):**
  - Dynamic category picker with fee annotations.
  - GPS locator with reverse-geocoded coordinates and map navigation links.
  - 5-photo evidence upload zone with client-side WebP compression.
  - Real-time client Zod schema validation.
- **Grievance Dossier (`/citizen/requests/[id]`):**
  - Interactive state transition timeline.
  - Staff investigation notes feed.
  - Evidence photo gallery and geospatial summary.
  - Ticket editing and cancellation/deletion (when eligible).
  - One-click resolution confirmation.
  - 7-day case reopening modal with mandatory reason prompt.
  - 5-star service satisfaction rating and feedback form.
- **Revenue & Invoicing (`/citizen/payments`):**
  - bKash Tokenized Gateway payment initiation.
  - Automated status polling upon gateway return.
  - Filterable payment ledger and official PDF invoice receipts.
- **Profile & Account:** Profile photo upload with drag-and-drop, name updates, and unclipped role badges.

### 3. 🛠️ Department Staff Field Desk (`/staff`)

- **Work Queues:** Dual-tab workspace for **Personal Assigned Queue** vs. **Department-Wide Queue**.
- **Field Filters:** Quick filtering by operational state (`ASSIGNED`, `IN_PROGRESS`), urgency tier, and search query.
- **SLA Monitor:** Visual alert banners for incidents nearing breach or overdue.
- **Field Workbench (`/staff/requests/[id]`):**
  - Incident dossier and evidence photo viewer.
  - 1-click Google Maps coordinate navigation.
  - Field investigation notes editor with pre-canned template chips.
  - State machine transition controls (`ASSIGNED` &rarr; `IN_PROGRESS`).

### 4. 🏛️ Municipal Administrator Operations Desk (`/admin`)

- **Citywide Command Overview (`/admin`):**
  - Executive KPI summary cards (Total volume, SLA compliance %, Revenue, Pending Triage).
  - Department workload distribution widget.
  - Category grievance volume breakdown widget.
  - Financial velocity telemetry.
  - Complete operations table with search, role filters, and pagination.
- **Personnel & User Directory (`/admin/users`):**
  - Search, filter by role (`CITIZEN`, `STAFF`, `ADMIN`), status (`ACTIVE`, `BLOCKED`, `DELETED`), and department.
  - Role upgrades, department assignment, and soft-delete/deactivate modal.
- **Municipal Departments (`/admin/departments`):**
  - Department management (Create, Edit, Archive, Restore).
  - Interactive Staff Roster Modal to inspect and assign field personnel.
- **Automated Routing Rules (`/admin/routing-rules`):**
  - Category-to-Department routing rules with priority weightings.
  - Create, update, archive, and reactivate rules.
- **SLA Breach & Escalation Desk (`/admin/sla`):**
  - Overdue ticket tracking and breach telemetry.
  - Category SLA target configuration modal (minutes, hours, or days).
  - Supervisor manual escalation trigger.
  - Batch automated breach processing job execution.
- **Audit Trail Ledger (`/admin/audit-logs`):**
  - Immutable system activity logs.
  - Structured modal showing actor, action classification, IP, timestamp, and before/after diff metadata.
- **Citizen Feedback Reports (`/admin/feedback-reports`):**
  - Citizen satisfaction telemetry, average rating distribution, and dissatisfaction alerts.
- **Municipal Ledger (`/admin/payments`):**
  - Citywide transaction ledger, payment gateway status reconciliation, and administrative receipts.

---

## 🗺️ Application Routes

| Route | Role Clearance | Purpose & View Structure |
| :--- | :---: | :--- |
| `/` | `Public` | Public portal homepage with live statistics, telemetry banner, and tracking modal |
| `/about-us` | `Public` | Civic charter, SLA commitments, benchmarks, and citizen rights |
| `/login` | `Public` | Credentials sign-in with **1-Click Demo Quick-Fill** & Google OAuth |
| `/register` | `Public` | Citizen account registration with instant form validation |
| `/account-verify` | `Public` | OTP 6-digit email address verification interface |
| `/forgot-password` | `Public` | Password recovery request with quick demo account selection |
| `/reset-password` | `Public` | Secure password reset form with token validation |
| `/unauthorized` | `Public` | Access denied security guard page with role-safe redirects |
| `/citizen` | `CITIZEN` | Citizen dashboard with incident feeds and SLA countdowns |
| `/citizen/report` | `CITIZEN` | 60-second incident intake wizard with GPS reverse-geocoding |
| `/citizen/requests/[id]` | `CITIZEN` | Complete grievance dossier, verification loop, and feedback form |
| `/citizen/payments` | `CITIZEN` | Payment history, bKash checkout desk, and invoice access |
| `/citizen/payments/[paymentId]` | `CITIZEN` | Verified payment transaction receipt and printable invoice |
| `/citizen/payments/result` | `CITIZEN` | bKash payment gateway return reconciliation & polling page |
| `/staff` | `STAFF` | Dual-view personal and department field queues |
| `/staff/requests/[id]` | `STAFF` | Field technician workbench, GPS navigator, and notes editor |
| `/admin` | `ADMIN` | Executive command center and municipal triage workbench |
| `/admin/users` | `ADMIN` | Personnel, staff, and citizen directory with role management |
| `/admin/departments` | `ADMIN` | Department management and interactive staff roster deployment |
| `/admin/routing-rules` | `ADMIN` | Automated routing rules and category dispatch pipelines |
| `/admin/sla` | `ADMIN` | SLA breach desk, duration configuration, and manual escalations |
| `/admin/audit-logs` | `ADMIN` | Immutable system audit log trail with structured JSON diff modals |
| `/admin/feedback-reports` | `ADMIN` | Citizen satisfaction ratings, analytics, and service benchmarks |
| `/admin/payments` | `ADMIN` | Citywide revenue ledger and gateway transaction reconciliation |
| `/admin/payments/[paymentId]` | `ADMIN` | Administrative payment transaction receipt |
| `/admin/requests/[id]` | `ADMIN` | Administrative grievance dossier and workflow executive control |

---

## 🛠️ Technology Stack

```
Frontend Architecture Stack:
Next.js 16 (App Router) ──── React 19 ──── TypeScript 5 ──── Tailwind CSS v4 ──── Bun 1.4
          │                                  │
          ▼                                  ▼
TanStack Query v5 + ofetch           TanStack Form + Zod v4           Base UI + Framer Motion
```

### 1. Frontend Core
- **Framework:** Next.js `16.3.7` (App Router, Server & Client Components)
- **Library:** React `19.2.8`
- **Language:** TypeScript `5.0+` (Strict Mode)
- **Styling:** Tailwind CSS `v4` with OKLCH tokens & glassmorphism utilities
- **Package Manager:** Bun `1.4.2`
- **Linter & Formatter:** Biome `2.4.2`

### 2. State & Networking
- **Server State & Caching:** `@tanstack/react-query` `v5.104.0`
- **Forms & Validation:** `@tanstack/react-form` `v1.33.5`, Zod `v4.6.5`
- **HTTP Client:** `ofetch` `v1.5.1` (configured with `credentials: "include"`)
- **OAuth:** `@react-oauth/google` `v0.13.5`

### 3. UI Components & Aesthetics
- **Primitives:** `@base-ui/react`, Radix / shadcn patterns
- **Icons:** `lucide-react` `v1.48.0`
- **Animations:** `framer-motion` `v14.0.0`, `tw-animate-css`
- **Notifications & Toasts:** `goey-toast` `v0.5.0`
- **Class Utilities:** `clsx`, `tailwind-merge` (`cn` helper)

### 4. Companion Backend Infrastructure
- **API Runtime:** Node.js, Express 5, TypeScript
- **Database & Cache:** PostgreSQL, Prisma 7, Redis
- **Media & Invoicing:** Cloudinary, PDFKit
- **Payments:** bKash Tokenized Checkout API

---

## 🔑 Demo Accounts

For rapid evaluation and testing, the seed populates these standard role accounts:

| Role Badge | Name & Persona | Email Address | Password | Access Clearance Scope |
| :---: | :--- | :--- | :---: | :--- |
| `ADMIN` | **Super Admin** | `superadmin@example.com` | `Password@123` | Citywide triage, user control, SLA config, departments, audit logs |
| `STAFF` | **Engr. Tariqul Islam** | `staff.drainage.1@civicflow.org` | `Password@123` | Drainage & Sewerage Department queues, investigation notes, progression |
| `CITIZEN` | **Sarah Khan** | `citizen@example.com` | `Password@123` | Submit grievances, bKash payments, verify resolution, feedback rating |

> [!TIP]
> **Instant 1-Click Demo Sign-In:**  
> The login page at `/login` features distinct **1-Click Demo Login** buttons that instantly populate credentials and authenticate into the corresponding role portal (`ADMIN`, `STAFF`, or `CITIZEN`) in a single click.

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) `1.4.2+` (Recommended) or Node.js `20+`
- Running instance of the **CivicFlow Backend API** (locally at `http://localhost:5000` or deployed at `https://civic-flow-api.vercel.app`)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/asif-shahriar-tauhid/CivicFlow-Frontend.git
cd CivicFlow-Frontend
bun install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```dotenv
# Backend API Base URL (normalized automatically to include /api/v1)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1

# Optional: Google OAuth Client ID for Google Sign-In
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3. Launch Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

Only browser-safe `NEXT_PUBLIC_` variables are utilized by the frontend:

| Variable | Required | Description | Default Fallback |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | No | Base URL of the CivicFlow REST API. Automatically normalizes trailing slashes and `/api/v1`. | `https://civic-flow-api.vercel.app/api/v1` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Optional | Google Cloud OAuth Client ID for enabling Google login. | `undefined` (Credential login functions independently) |

> [!WARNING]
> Do **NOT** place backend database URLs, JWT secrets, bKash app secrets, or SMTP credentials in `.env.local`. All sensitive keys belong strictly in the backend repository.

---

## 🔐 Backend Integration & Authentication

### HTTP-Only Cookie Mechanism

CivicFlow implements defense-in-depth authentication managed entirely by the backend:

- **Session Tokens:** `accessToken` (1-day validity) and `refreshToken` (7-day validity) are stored in secure HTTP-only cookies.
- **Credential Handling:** The frontend API client configures `credentials: "include"` on every request to pass cookies across origins.
- **Session Hydration:** Upon mounting, `AuthProvider` queries `/api/v1/auth/me`. If valid, the current user identity and clearance role are seeded into the TanStack Query cache.
- **Route Protection:** `RoleGuard` and layout wrappers verify that the active user matches required clearance levels, instantly rerouting unauthorized users to `/unauthorized` or `/login`.
- **CORS Notice:** For local development, the backend must whitelist `http://localhost:3000` in its CORS policy with `credentials: true`.

---

## 💳 Municipal Payments (bKash)

For service request categories requiring a statutory municipal fee (e.g., specialized demolition, commercial septic clearing, hazardous waste pickup), CivicFlow integrates the **bKash Tokenized Checkout** pipeline:

```mermaid
sequenceDiagram
    autonumber
    actor Citizen
    participant FE as CivicFlow Frontend
    participant BE as CivicFlow API
    participant bKash as bKash Payment Gateway

    Citizen->>FE: Click "Pay Municipal Fee" (RequestFeePanel)
    FE->>BE: POST /api/v1/requests/:id/payment/initiate
    BE->>bKash: Create Payment & Fetch Gateway URL
    bKash-->>BE: Return bkashURL
    BE-->>FE: Return checkout redirect URL
    FE->>bKash: Redirect Citizen to bKash Checkout
    Citizen->>bKash: Authorize Payment with PIN / OTP
    bKash->>BE: Redirect to Backend Callback (Execute & Settle)
    BE->>FE: Redirect to /citizen/payments/result?paymentId=...&status=...
    FE->>BE: Poll Payment Status until Terminal State (COMPLETED)
    FE->>Citizen: Display Verified Receipt & Enable Invoice Download
```

---

## 📁 Project Structure

```text
src/
├── api/                    # Typed REST API service functions (ofetch wrappers)
│   ├── auth.api.ts
│   ├── request.api.ts
│   ├── department.api.ts
│   ├── payment.api.ts
│   ├── notification.api.ts
│   ├── sla.api.ts
│   ├── auditLog.api.ts
│   └── user.api.ts
├── app/                    # Next.js App Router (Pages, Layouts, Route Groups)
│   ├── (dashboard)/        # Role-gated authenticated portal subtrees
│   │   ├── admin/          # Citywide admin operations desk
│   │   ├── citizen/        # Citizen grievance desk & intake wizard
│   │   └── staff/          # Field crew queues & investigation workbench
│   ├── (public)/           # Public views
│   │   ├── (authentication)/ # Login, Register, Verify, Forgot, Reset
│   │   └── (marketing)/    # Homepage and About Us / Charter
│   ├── globals.css         # Tailwind v4 theme tokens & glassmorphism utilities
│   ├── icon.svg            # Favicon mark vector
│   ├── layout.tsx          # Root provider shell & HTML scaffold
│   ├── not-found.tsx       # 404 recovery page
│   └── unauthorized/       # Access denied resolution page
├── asset/                  # Brand SVG marks, vector badges, and iconography
├── components/             # Reusable and modular component architecture
│   ├── common/             # UserAvatar, RoleGuard, Spinner, StatusBadges
│   ├── form/               # TanStack Form + Zod input modules
│   ├── layouts/            # DashboardHeader, Sidebar, Public Header/Footer
│   ├── modules/            # Feature-specific composite modules
│   │   ├── admin/          # SLA modals, user management, audit tables
│   │   ├── home/           # Telemetry banner, service grid, quick tracker
│   │   ├── payments/       # Fee panels, receipts, invoice viewers
│   │   ├── profile/        # Avatar uploader, settings dialog
│   │   └── requests/       # Transition controls, notes, assign modals
│   └── ui/                 # Atomic design primitives (Button, Card, Dialog, Badge)
├── constants/              # State machine graphs, transitions, mock fallbacks
├── hooks/                  # TanStack Query query/mutation hooks
├── lib/                    # apiClient, authUtils, imageUtils, paymentUtils
├── providers/              # AuthProvider, QueryProvider, GoogleOAuthProvider
├── types/                  # Authoritative TypeScript interfaces & domain models
└── validation/             # Client-side Zod schemas for all user inputs
```

---

## 🧑‍💻 Development Workflow

When extending CivicFlow, follow this predictable 8-step pipeline:

```
[1. Types & Zod] ──> [2. API Caller] ──> [3. Query/Mutation Hook] ──> [4. UI Component]
         │                                                                   │
[8. Verify & PR] <── [7. Typecheck & Lint] <── [6. Responsive Audit] <── [5. Skeletons/Errors]
```

1. **Define Schema & Types:** Update domain interfaces in `src/types/` and validation schemas in `src/validation/`.
2. **API Endpoint Function:** Add the typed API caller to `src/api/<feature>.api.ts` utilizing `apiClient`.
3. **Query/Mutation Hook:** Implement the TanStack Query hook in `src/hooks/<feature>.hooks.ts` with explicit query keys and invalidation logic.
4. **Build Component/Page:** Implement the UI under `src/components/modules/` or the corresponding App Router route.
5. **State Feedback:** Provide clean skeleton loaders, error callouts, empty states, and toast notifications.
6. **Responsive Audit:** Verify mobile drawer behavior, touch targets (&ge; 44px), and desktop viewports.
7. **Typecheck & Lint:** Run `bun x tsc --noEmit` and `bun run lint`.
8. **Verify & Review:** Verify against end-to-end user workflows.

---

## ✅ Quality Assurance & Verification

The project includes strict automated formatting, linting, and TypeScript compilation:

| Command | Purpose | Underlying Tool |
| :--- | :--- | :--- |
| `bun run dev` | Starts local Next.js development server with hot reload | Next.js App Router |
| `bun run build` | Builds optimized production bundle | Next.js Compiler |
| `bun run start` | Serves production build | Next.js Server |
| `bun run lint` | Runs comprehensive codebase linting | Biome `2.4.2` |
| `bun run format` | Formats code in place according to design rules | Biome Formatter |
| `bun x tsc --noEmit` | Strict type verification across all modules | TypeScript `5.0+` |

---

## ♿ Accessibility & Design Principles

CivicFlow adheres to the design specifications defined in `DESIGN.md`:

- **Outdoor Contrast:** Body copy and status badges maintain a minimum 4.5:1 contrast ratio against light and dark backdrops (WCAG AA).
- **Geometry & Hierarchy:** Buttons, search pills, filter tabs, and status badges use curved pill geometry (`rounded-full`), while data tables, dialogs, and structural cards use refined architectural radii (`rounded-2xl`).
- **Tabular Data:** Ticket identifiers (`REQ-2026-00101`), GPS coordinates, monetary figures (BDT ৳), and countdown clocks use monospace tabular numerals (`font-mono`).
- **Responsive Navigation:** Desktop features an expandable/collapsible sidebar with persistent state; mobile uses an accessible slide-over drawer with backdrop blur and touch dismiss.
- **Evidence Compression:** User-submitted camera attachments are automatically converted to optimized WebP images on the canvas before dispatch, saving user mobile bandwidth.

---

## 📊 Implementation Audit

| Module Area | Tracked Features | Completed | Status |
| :--- | :---: | :---: | :---: |
| **Authentication & Profile** | 10 | 10 | 🟢 Complete (100%) |
| **Citizen Portal & Reporting** | 14 | 14 | 🟢 Complete (100%) |
| **Payments & Invoicing (bKash)** | 7 | 7 | 🟢 Complete (100%) |
| **Department Staff Field Desk** | 10 | 10 | 🟢 Complete (100%) |
| **Municipal Administrator Desk** | 16 | 16 | 🟢 Complete (100%) |
| **Notifications & Subscriptions** | 3 | 3 | 🟢 Complete (100%) |
| **Public & Marketing Surface** | 4 | 4 | 🟢 Complete (100%) |
| **Total Workflows Implemented** | **64** | **64** | 🟢 **100% Production Ready** |

_For granular endpoint-to-component mappings, refer to [implementation_status_tracker.md](implementation_status_tracker.md)._

---

## 🧰 Troubleshooting

### 1. API Requests Fail with Network Error
- Verify the backend server is running and accessible at the URL in `NEXT_PUBLIC_API_BASE_URL`.
- Confirm backend CORS configuration explicitly permits `http://localhost:3000` with credentials enabled.

### 2. Session Hydration Stuck / Role Guard Redirect Loops
- Ensure third-party cookies or cross-site tracking protections in the browser are not discarding HTTP-only cookies if running on disparate local ports.
- Verify that your local API URL in `.env.local` points to port `5000` and not port `3000`.

### 3. Remote Evidence Photos Fail to Load
- Next.js requires remote image domains to be declared in `next.config.ts`.
- The configuration currently allows `res.cloudinary.com`. If using a different storage bucket, add the remote pattern to `next.config.ts`.

### 4. Google Sign-In Button Inactive
- Confirm `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is defined in `.env.local`.
- Ensure `http://localhost:3000` is added under **Authorized JavaScript origins** in your Google Cloud Console OAuth Client credentials.

---

## 📄 Related Documentation

- [Product Specification (`PRODUCT.md`)](PRODUCT.md) — Comprehensive functional requirements, persona definitions, and domain rules.
- [Design System Guide (`DESIGN.md`)](DESIGN.md) — Visual tokens, typography scales, pill geometry rules, and UI guidelines.
- [Backend Architecture Overview (`backend_overview.md`)](backend_overview.md) — Express 5 controllers, Prisma models, Redis keys, and API contracts.
- [Endpoint & UI Audit Tracker (`implementation_status_tracker.md`)](implementation_status_tracker.md) — Exhaustive checklist of all 64 implemented backend endpoints and matching frontend views.

---

<div align="center">

<img src="./public/civicflow-logo.svg" alt="CivicFlow Logo" width="28" height="28" align="absmiddle" style="vertical-align: middle; margin-right: 6px;" />
<strong>CivicFlow Municipal Systems</strong> &nbsp;•&nbsp; Designed for urban public service excellence.
<br>
<sub>&copy; 2026 CivicFlow. Released under the MIT License.</sub>

</div>
