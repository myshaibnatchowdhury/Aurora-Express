# অরোরা এক্সপ্রেস | AURORA EXPRESS
## Complete Production-Grade Multi-Tenant Bus Ticket Booking & Counter Management SaaS Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmyshaibnatchowdhury%2FAurora-Express&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY)

![Aurora Express Official Logo](/images/aurora-logo.jpg)

### Safe Journey • Better Tomorrow
**অরোরা এক্সপ্রেস (Aurora Express)** is an enterprise-grade, multi-tenant bus ticket booking, fleet operations, and counter point-of-sale (POS) SaaS web application engineered with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase PostgreSQL**.

---

## 🌟 Key Platform Features

### 1. 🚌 Public Passenger Experience
- **Pixel-Accurate Homepage**: Recreated faithfully to the official brand reference, featuring luxury coach visuals, scenic gradient overlays, live booking search, popular route cards, and service highlights.
- **Dynamic Trip Search Engine**: Instant multi-criteria search by origin city, destination city, date, passenger count, bus model, and fare range.
- **Concurrency-Safe Interactive Seat Selector**: Real-time 2+2 and 2+1 VIP seat layouts with driver cockpit orientation, aisle mapping, and 10-minute hold lock mechanism.
- **Multilingual Support (বাংলা & English)**: Complete dual-language switching with native Bengali numerals and Bangladeshi Taka (`৳`) currency formatting.
- **Official Digital QR E-Ticket**: Instant ticket issuance with cryptographically verifiable QR codes, PNR numbers, passenger details, and print-ready stylesheets.
- **My Bookings & PNR Tracking**: Self-service ticket retrieval, thermal reprint, and 15% fee refund engine.

### 2. 🏪 Counter Point of Sale (POS)
- **High-Speed Counter Booking**: Keyboard-accessible, fast ticket booking interface designed for busy terminal counters (Gabtoli, Sayedabad, Dampara, Kolatoli, etc.).
- **Shift Opening & Closing**: Daily cash drawer reconciliation, cash sales recording, actual physical cash counting, and automated variance calculation.
- **Direct Thermal Printing**: One-click thermal boarding pass printout.

### 3. 🏢 Bus Company Dashboard (Tenant: Aurora Express)
- **Multi-Tenant Operations**: Isolated company workspace with independent routes, fleet, counters, trips, and accounting records.
- **Fleet Management**: Scania Multi-Axle, Hyundai Universe Luxury, Volvo B11R, and Hino 1J Plus coaches with amenity configurations.
- **Route & Stop Master**: Multi-stop routing with boarding points, dropping points, and distance calculations.
- **Trip Scheduling**: Departure and arrival scheduling, dynamic seat inventory generation, and base fare configuration.
- **Refund & Cancellation Engine**: Automated 15% cancellation fee calculation and refund approvals.
- **Operational & Financial Reports**: Daily sales, online collections, agent commissions, and occupancy analytics.

### 4. 🌐 SaaS Super Admin Console
- **Platform Overview**: Platform-wide subscription revenue, active tenant fleet counts, and user metrics.
- **Tenant Onboarding & Suspension**: One-click company approval, suspension, and tier management.
- **SaaS Subscription Plans**: Starter, Professional, and Enterprise SaaS plans with customizable limits.

### 5. 🤝 Agent & Reseller Portal
- **Reseller Management**: Dedicated portal for authorized ticketing agents (e.g. Shohoz Travels).
- **Automated Commission Engine**: Fixed percentage commission ledger (6.5%) with credit limit tracking and balance settlements.
- **Immutable Financial Ledger**: Double-entry bookkeeping logic ensuring financial transparency.

### 6. 📱 Boarding & Gate Scanner
- **Terminal Departure Manifest**: Real-time passenger boarding checklist for station officers and bus captains.
- **Live QR Verification**: Instant verification token checking with verified status badges.

### 7. 💳 Payment Gateway Simulator
- **Bangladesh Payment Channels**: Integrated sandbox simulator supporting **bKash**, **Nagad**, **Rocket**, **Credit/Debit Cards**, and **Cash at Counter**.
- **Interactive OTP & PIN Simulation**: Safe development sandbox clearly marked with zero financial liability, ready for live SSLCommerz/bKash API keys.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling & Design** | Tailwind CSS v4, Lucide Icons, Custom Noto Sans Bengali & Inter |
| **Database & Auth** | Supabase PostgreSQL, Row Level Security (RLS), ACID Transactions |
| **QR Code Engine** | `qrcode` library with secure verification tokens |
| **State & Concurrency** | Central concurrency-safe atomic seat hold engine with auto-expiration |

---

## 🚀 Getting Started

### 1. Set Active Workspace
Ensure your IDE workspace is opened at:
```bash
C:\Users\UESR\.gemini\antigravity\scratch\aurora-express
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the live platform.

### 4. Production Build & Run
```bash
npm run build
npm run start
```

---

## 🗄️ Database Setup & Supabase Migrations

The complete PostgreSQL schema with foreign keys, indexes, triggers, and Row Level Security (RLS) is located at:
```
supabase/migrations/20261029000000_aurora_express_schema.sql
```

To deploy to a live Supabase project:
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Run the SQL script in your Supabase SQL Editor.
3. Configure your environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

*Note: The platform features a high-fidelity in-memory database store seeded with rich Aurora Express fleet, trips, counters, routes, and bookings, running 100% out-of-the-box even without external cloud credentials!*

---

## 👥 Pre-configured Personas & Test Credentials

Use the **User Menu** in the top navigation bar to switch between test personas with 1 click:
1. **Passenger**: `kamrul.hasan@gmail.com`
2. **Counter Operator (Gabtoli)**: `counter.gabtoli@auroraexpress.com`
3. **Company Owner (Managing Director)**: `owner@auroraexpress.com`
4. **SaaS Super Admin (Exclusive)**: Mysha Ibnat Chowdhury (`myshaibnatchowdhury@gmail.com`)
5. **Agent Reseller Partner (Shohoz)**: `agent.shohoz@partner.com`
6. **Boarding Staff (Sayedabad)**: `boarding.sayedabad@auroraexpress.com`

---

## 📄 License & Brand Ownership
© 2026 অরোরা এক্সপ্রেস (Aurora Express Ltd.). All rights reserved.
Safe Journey • Better Tomorrow
