# ShopSphere India — Production-Ready Full-Stack E-Commerce Platform

A modern, production-grade Indian e-commerce application built from scratch with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.

Designed specifically for the Indian market with **INR (₹) currency**, **pan-India PIN-code logistics**, **Razorpay integration** (with server-side HMAC-SHA256 signature verification), and **Cash on Delivery (COD)**.

---

## 🌟 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16.3+ (App Router), React 19, Tailwind CSS, Lucide Icons, Sonner Toasts, Canvas-Confetti |
| **Backend & APIs** | Next.js Route Handlers, Server Actions, Zod 4 Schema Validation |
| **Database & ORM** | Prisma ORM, SQLite (`prisma/dev.db` for zero-configuration local runs) + PostgreSQL production mirror (`prisma/schema.postgresql.prisma`) |
| **Authentication** | Cryptographic salted Bcrypt password hashing, JWT session cookies (HTTP-Only, SameSite, Secure), Role-Based Access Control (RBAC) |
| **Payments** | Razorpay SDK (Orders API & Webhook/Verification) + Automated Mock Fallback Adapter for local sandbox testing, Cash on Delivery (COD) |
| **State Management** | Zustand (Persistent Cart & Wishlist with localStorage sync) |
| **SEO & Compliance** | Dynamic XML Sitemap (`/sitemap.xml`), Robots (`/robots.txt`), Open Graph metadata, DPDP Act 2023 compliant policies |

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure Node.js 20+ and npm are installed.

```bash
# Verify node and npm
node -v
npm -v
```

### 2. Environment Configuration
The application comes preconfigured with default environment variables in `.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-jwt-token-shopsphere-2026-production-ready"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_shopsphere2026"
RAZORPAY_KEY_SECRET="test_key_secret_shopsphere_2026"
ADMIN_EMAIL="admin@shopsphere.com"
ADMIN_PASSWORD="Admin@ShopSphere2026"
```

### 3. Database Migration & Realistic Seeding
Run the seed script to populate 6 categories, 32 authentic Indian products with variants/images/specs, active coupons, verified reviews, and customer orders:

```bash
# Push Prisma schema to SQLite
npx prisma db push

# Populate realistic Indian catalog and demo accounts
npm run seed
```

### 4. Run Automated Test Suite
Verify database models, bcrypt encryption, coupon calculations, tax/shipping logic, and HMAC signatures:

```bash
npx tsx scripts/verify-store.ts
```

### 5. Build & Launch

```bash
# Production Build (Compiles all 44 routes and static pages)
npm run build

# Start Production Server
npm run start
# or for local development
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Demo Credentials

Quick autofill buttons are built directly into the login screen (`/login`):

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Admin** | `admin@shopsphere.com` | `Admin@ShopSphere2026` | Full access to `/admin` dashboard, product CRUD, category editor, order status updates, coupon management, and review moderation |
| **Customer** | `aarav.sharma@example.com` | `Password@123` | Storefront browsing, cart, checkout with saved addresses in Delhi/Gurugram, order tracking, wishlist |
| **Customer 2** | `priya.patel@example.com` | `Password@123` | Secondary customer account |

---

## 🎟️ Active Demo Coupons

| Code | Type | Value | Min Order | Max Discount | Description |
|---|---|---|---|---|---|
| `WELCOME10` | Percentage | 10% | ₹500 | ₹500 | 10% off for first-time customers |
| `FESTIVE25` | Percentage | 25% | ₹2,000 | ₹1,500 | 25% festive celebration discount |
| `FLAT500` | Fixed | ₹500 | ₹2,500 | — | Flat ₹500 instant off on premium orders |
| `FREESHIP` | Fixed | ₹99 | ₹499 | — | Waives standard shipping on sub-₹999 orders |

*Note: All orders of ₹999 or above automatically qualify for complimentary free shipping.*

---

## 🗺️ Website Structure & Routes

### 🌐 Storefront Pages
- `/` — Homepage with Hero banners, featured categories, trending products, best sellers, promotions, and customer reviews.
- `/products` — Multi-faceted catalog with live URL query parameters (brand, price slider, rating, availability, sort).
- `/products/[slug]` — Product detail page with image gallery, zoom preview, variant selector (size/color), stock counter, specifications, customer reviews, and related products.
- `/categories` & `/categories/[slug]` — Category hierarchies and collection showcases.
- `/search` — Live search query redirector with header autocomplete.
- `/cart` — Dynamic cart summary, coupon application, free shipping progress bar, and tax breakdown.
- `/checkout` — Multi-step checkout with saved address selector, Razorpay popup modal, COD toggle, and confetti celebration.
- `/about` — ShopSphere brand mission, craft clusters, and artisan partnerships.
- `/contact` — Interactive concierge support form (submits to `/api/contact`) with Bengaluru corporate details.
- `/faq` — Searchable accordion FAQ covering payments, pan-India logistics, and cancellations.
- `/privacy-policy`, `/terms`, `/shipping-policy`, `/refund-policy` — Compliance documents.

### 👤 Customer Account Portal (Protected)
- `/account` — Account overview dashboard, quick stats, and recent order highlights.
- `/account/orders` — Complete order history with order cards.
- `/account/orders/[id]` — Order details with live 4-stage tracking progress bar (`Confirmed` &rarr; `Processing` &rarr; `Shipped` &rarr; `Delivered`), item breakdown, and cancellation button.
- `/account/profile` — Name, email, phone updater and password change form.
- `/account/addresses` — Saved delivery addresses manager (add, delete, set default).
- `/account/wishlist` — Saved favorites with "Move to Cart" action.
- `/account/settings` — Notification alerts and security preferences.

### 🛡️ Admin Command Center (Protected by ADMIN Role)
- `/admin` — KPI dashboard showing Total Revenue, Total Orders, Total Customers, Products Count, Low-Stock alerts, and Recent Orders table.
- `/admin/products` — Product catalog with active status toggle and delete controls.
- `/admin/products/new` — Comprehensive product creator with variant builder, image URLs, specifications, and tags.
- `/admin/products/[id]/edit` — Product editor with prepopulated values.
- `/admin/categories` — Category manager (create, edit, delete, preview image).
- `/admin/orders` — Orders management table with search and filters.
- `/admin/orders/[id]` — Order inspection with real-time status switcher (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- `/admin/users` — User directory with order count, total spend, and account activation toggles.
- `/admin/coupons` — Coupon manager (percentage/fixed, minimum order, usage limits, start/end dates).
- `/admin/reviews` — Review moderator (approve, reject, delete reviews).
- `/admin/settings` — Store configurations, currency, GST rates, and logistics thresholds.

---

## 🛡️ Security Architecture

1. **Server-Side Price & Stock Verification**:
   The frontend never sends final price or total to payment processors. During `/api/checkout/create-order` and `/api/checkout/verify-payment`, all item prices and inventory counts are re-queried directly from Prisma database models.
2. **Cryptographic Payment Verification**:
   Razorpay payment signatures are validated using standard `crypto.createHmac("sha256", secret)` over `order_id|payment_id`.
3. **Session Security**:
   Sessions use signed JSON Web Tokens stored in HTTP-Only, SameSite cookies with base64 payload validation in `middleware.ts`.
4. **Input Sanitization**:
   All user inputs and form submissions are validated strictly on the server using **Zod**.
5. **Database Transaction Safety**:
   Order placement and stock decrements are executed inside Prisma interactive transactions to eliminate race conditions or overselling.

---

## 📄 License
MIT &copy; 2026 ShopSphere India Technologies Pvt. Ltd.
