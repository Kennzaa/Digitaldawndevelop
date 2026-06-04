# plan.md — Digital Dawn Develop (3D Digital Agency Website)

## 1) Objectives
- **Delivered (Complete):** Production-ready 3D digital agency website for **Digital Dawn Develop** with a premium futuristic look.
- Blue/white brand system with **glassmorphism** across content pages, plus an **immersive dark 3D hero** (blue glow) inspired by the reference WebGPU/waitlist vibe.
- Customer flow: **browse → select services → submit request → order saved to MongoDB → show prefilled mailto + WhatsApp deep link**.
- **Email+Password** authentication (JWT) with protected **Customer “My Orders”** and **Admin Dashboard** (stats, filters, status update).
- 3D implementation is **WebGL-compatible** across browsers.
  - **Important implementation note:** The hero uses **vanilla Three.js + bloom** (not R3F JSX) to avoid conflicts with the project’s visual-edits/babel instrumentation.

## 2) Implementation Steps

### Phase 1 — Core workflow (build directly; no external integrations) ✅ **COMPLETED**
**User stories (Completed)**
1. As a visitor, I can view the hero and scroll to explore without performance issues on common browsers.
2. As a customer, I can select multiple services and see them summarized before submitting.
3. As a customer, I can submit a request and know it was received (success UI).
4. As the owner, I can see submitted orders persisted in MongoDB.
5. As a customer, I can immediately contact the owner via mailto/WhatsApp with prefilled context.

**Backend (FastAPI + MongoDB) (Completed)**
- Implemented Mongo collections: `users`, `orders`.
- Implemented services config endpoint:
  - `GET /api/services`
- Implemented orders endpoint:
  - `POST /api/orders` (supports guest + optional authenticated association)

**Frontend (React CRA) (Completed)**
- Implemented Home + Order flow (service selection + summary).
- Order submission:
  - Persists order to backend
  - Shows success state + **confetti animation**
  - Provides outbound actions:
    - `mailto:Admin@digitaldawndevelop.xyz?...`
    - `https://wa.me/6285768409658?text=...`

**3D (WebGL) (Completed)**
- Implemented 3D hero with bloom/glow, scanline + noise overlays, and parallax feel.
- Service section includes “3D icon effects” (premium floating/tilt/glow styling per service).

**Checkpoint tests (Completed)**
- Backend tests: **13/13 passed**.
- Core frontend flow verified end-to-end (real click):
  - select services → submit → DB record exists → success screen shows correct mailto/WhatsApp.

---

### Phase 2 — V1 app development (integrate auth + admin dashboard) ✅ **COMPLETED**
**User stories (Completed)**
1. As a customer, I can register with email+password and log in securely.
2. As a logged-in customer, my order is associated with my account (when submitted while logged in).
3. As an admin, I can log in and view all orders in a dashboard.
4. As an admin, I can change order status (new/in-progress/done/cancelled).
5. As a customer, I can view my submitted orders and their statuses.

**Backend: Auth + authorization (Completed)**
- JWT auth + roles and admin seeding:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Customer orders:
  - `GET /api/orders/me`
- Admin dashboard endpoints:
  - `GET /api/admin/orders`
  - `GET /api/admin/stats`
  - `PATCH /api/admin/orders/{id}`

**Frontend: Auth flows + protected routes (Completed)**
- Implemented pages:
  - `/login`, `/register`, `/my-orders`, `/admin`
- Token stored in localStorage and attached on requests.
- Route protection:
  - Customer pages protected
  - Admin dashboard requires admin role
- Admin dashboard UI:
  - Stats cards
  - Status filter tabs
  - Orders list with detail dialog
  - Status update controls

**Design/UX polish (Completed)**
- Applied design system (blue/white + glass panels + micro-interactions).
- Confetti success animation implemented.
- 3D hero implemented as **vanilla Three.js** to avoid R3F JSX + visual-edits conflicts.

**Checkpoint tests (Completed)**
- Register/login → place order → appears in My Orders.
- Admin login → see orders → update status.

---

### Phase 3 — Production hardening + performance + content (Optional / On request)
**User stories (Planned)**
1. As a visitor on mobile, the 3D effects degrade gracefully and still look premium.
2. As a user, I get helpful validation errors without losing my form input.
3. As an admin, I can search/filter orders quickly.
4. As a customer, I can reorder or resubmit a similar request easily.
5. As the owner, I can deploy and configure env vars without code changes.

**Hardening (Planned)**
- Performance tuning for the 3D hero:
  - adaptive DPR / quality tiers
  - pause rendering when offscreen
  - reduce bloom intensity on low-end devices
  - optional static fallback image
- Strengthen validation and UX:
  - inline validation + clearer error handling
  - improved loading/empty/error states
- Content/SEO:
  - add About/Portfolio/Testimonials (placeholders or real)
  - refine metadata and basic SEO

**Testing (Planned)**
- Regression pass across:
  - auth
  - orders
  - admin dashboard
  - mobile breakpoints
  - WebGL compatibility

---

### Phase 4 — Optional enhancements (post-V1)
**User stories (Planned)**
1. As an admin, I can export orders to CSV.
2. As a customer, I can attach references/links to my order.
3. As the owner, I can configure multiple WhatsApp numbers/emails via admin settings.
4. As a visitor, I can switch theme intensity (reduced motion / reduced effects).
5. As a customer, I can receive an in-app confirmation page with a printable summary.

**Enhancements (Planned)**
- CSV export for admin.
- Richer order fields (attachments/links, priority, preferred channel, etc.).
- Site-wide **reduced motion** toggle (in addition to `prefers-reduced-motion`).
- Additional admin tools (search, pagination, bulk status update).

## 3) Next Actions
1. **(Optional)** Confirm if you want to keep the immersive dark hero permanently (current implementation), or prefer a lighter hero background while keeping bloom/glow.
2. **(Optional)** Decide if orders should require login or stay as current (guest allowed + optional association when logged in).
3. **(Optional)** Add more marketing content sections: Portfolio, Testimonials, Pricing/Packages, Case Studies.
4. **(Optional)** Implement Phase 3 performance hardening (mobile quality tiers, offscreen pause, reduced effects).
5. **(Optional)** Implement Phase 4 enhancements (CSV export, richer order fields, reduced-motion toggle).

## 4) Success Criteria
✅ **Already achieved**
- 3D hero renders smoothly in WebGL with bloom/glow + scanline/noise aesthetic.
- Customer can select services and submit an order; order persists in MongoDB.
- Success screen provides working prefilled **mailto** + **WhatsApp** deep link.
- JWT auth works (register/login/me), protected customer routes + admin dashboard.
- Admin can view and update order statuses; customers can see their own orders.
- Backend endpoints tested: **13/13 passed**.

📌 **Future (optional) success criteria**
- Mobile performance optimizations and reduced-motion controls.
- Additional marketing content and admin productivity enhancements (CSV export, search, pagination).