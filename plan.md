# plan.md — Digital Dawn Develop (3D Digital Agency Website)

## 1) Objectives
- Deliver a production-ready 3D digital agency website with blue/white gradient, glassmorphism, bloom/glow, and animated 3D service icons.
- Provide customer flow: browse → select services → submit request → order saved to MongoDB → show prefilled **mailto** to Admin@digitaldawndevelop.xyz + **WhatsApp** deep link to 085768409658.
- Provide Email+Password auth (JWT) for customers and protected **Admin dashboard** to manage incoming orders.
- Implement WebGL-compatible Three.js/R3F hero inspired by the provided WebGPU/waitlist references: futuristic scan/bloom + “scroll to explore” + confetti success.

## 2) Implementation Steps

### Phase 1 — Core workflow (build directly; no external integrations)
**User stories**
1. As a visitor, I can view the hero and scroll to explore without performance issues on common browsers.
2. As a customer, I can select multiple services and see them summarized before submitting.
3. As a customer, I can submit a request and know it was received (success UI).
4. As the owner, I can see submitted orders persisted in MongoDB.
5. As a customer, I can immediately contact the owner via mailto/WhatsApp with prefilled context.

**Backend (FastAPI + MongoDB)**
- Define Mongo models/schemas: `users`, `orders` (status, services[], brief, budget?, contact, createdAt).
- Create minimal endpoints (no auth yet):
  - `POST /api/orders` create order
  - `GET /api/orders` list orders (temporarily open for dev)
  - `PATCH /api/orders/{id}` update status
- Add validation (Pydantic), consistent error responses, and server-side timestamps.

**Frontend (React CRA)**
- Build core pages (no auth yet): Home → Services → Order.
- Service multi-select (cart-like) with clear selected-state and summary.
- Order form submit:
  - Persist to backend
  - Show success state + confetti
  - Render buttons:
    - `mailto:Admin@digitaldawndevelop.xyz?subject=Order%20Request&body=...`
    - `https://wa.me/6285768409658?text=...`
- Add basic responsive layout + glass cards + gradient background.

**3D (WebGL via R3F)**
- Implement hero canvas:
  - Gradient “sky” + emissive/bloom objects
  - Scanline/noise overlay (shader or postprocessing)
  - Subtle mouse-parallax camera
  - “Scroll to explore” cue
- Implement 5 service 3D icons (simple meshes + materials + glow) with hover/float animation.

**Checkpoint tests (end-to-end)**
- Verify: select services → submit → DB record exists → success screen shows mailto/WhatsApp with correct prefilled text.
- Verify: hero renders on Chrome/Firefox/Safari (WebGL), acceptable FPS on mid devices.

---

### Phase 2 — V1 app development (integrate auth + admin dashboard)
**User stories**
1. As a customer, I can register with email+password and log in securely.
2. As a logged-in customer, my order is associated with my account.
3. As an admin, I can log in and view all orders in a dashboard.
4. As an admin, I can change order status (new/in-progress/done) and it updates instantly.
5. As a customer, I can view my submitted orders and their statuses.

**Backend: Auth + authorization**
- Add bcrypt password hashing.
- Implement JWT auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Add roles (`customer`, `admin`) and protect routes:
  - Customers: create order, list own orders
  - Admin: list all orders, update any order
- Harden order APIs:
  - `GET /api/orders/me` (customer)
  - `GET /api/admin/orders` (admin)
  - `PATCH /api/admin/orders/{id}` (admin)

**Frontend: Auth flows + protected routes**
- Add pages: Register, Login.
- Persist token (localStorage) + attach Authorization header.
- Protected route guards:
  - Customer: Order + My Orders
  - Admin: Dashboard
- Admin dashboard UI:
  - Orders table/cards, filters by status, detail drawer/modal
  - Status update control

**Design/UX polish (V1)**
- Keep blue/white gradient identity across all pages.
- Refine glassmorphism components, hover states, micro-interactions.
- Ensure confetti success animation works reliably on repeated submissions.

**Checkpoint tests (end-to-end)**
- Register/login → place order → appears in My Orders.
- Admin login → see all orders → update status → customer sees updated status.

---

### Phase 3 — Production hardening + performance + content
**User stories**
1. As a visitor on mobile, the 3D effects degrade gracefully and still look premium.
2. As a user, I get helpful validation errors without losing my form input.
3. As an admin, I can search/filter orders quickly.
4. As a customer, I can reorder or resubmit a similar request easily.
5. As the owner, I can deploy and configure env vars without code changes.

**Hardening**
- Add input validation + rate limiting light (basic) + CORS/env config.
- Add loading/empty/error states for all data fetches.
- Improve 3D performance:
  - adaptive DPR, pause render when offscreen, reduce postprocessing on low power.
- Add SEO-friendly content sections (about, process, testimonials placeholders).

**Testing**
- One full regression pass: auth, orders, admin dashboard, 3D rendering across breakpoints.

---

### Phase 4 — Optional enhancements (post-V1)
**User stories**
1. As an admin, I can export orders to CSV.
2. As a customer, I can attach references/links to my order.
3. As the owner, I can configure multiple WhatsApp numbers/emails via admin settings.
4. As a visitor, I can switch theme intensity (reduced motion / reduced effects).
5. As a customer, I can receive an in-app confirmation page with a printable summary.

- CSV export, richer order fields, better admin tools.
- “Reduced motion” toggle and accessibility pass.

## 3) Next Actions
1. Confirm admin account bootstrap method (seed env var admin email/password vs first-user-is-admin).
2. Confirm required order fields (name, company, phone, budget range, deadline, notes, attachments links).
3. Start Phase 1 build: backend order endpoints + frontend selection+submit + 3D hero + confetti.
4. Run end-to-end test for core flow; fix until stable.
5. Proceed to Phase 2 auth + admin dashboard.

## 4) Success Criteria
- 3D hero + service icons render smoothly (WebGL) with bloom/glow, responsive and visually consistent with blue/white gradient.
- Customer can select services and submit an order; order persists in MongoDB.
- Success screen provides working prefilled mailto + WhatsApp deep link.
- JWT auth works (register/login/me), protected customer routes + admin dashboard.
- Admin can view and update order statuses; customers can see their own orders and statuses.
- No broken states: clear loading/error UI and consistent API validation.