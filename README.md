# 🔥 Melt 9 — Online Food Ordering & Kitchen Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Firebase-orange?style=for-the-badge&logo=firebase)](https://melt-9.web.app/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

> A modern, full-stack, real-time online restaurant ordering platform and kitchen management system built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Firebase Cloud Services**.

---

## 🔗 Live Demo

Experience the live application hosted on Firebase Hosting:
👉 **[https://melt-9.web.app/](https://melt-9.web.app/)**

---

## 📌 Project Overview

**Melt 9** is a digital storefront and real-time kitchen operations dashboard designed for modern fast-casual restaurants specializing in gourmet burgers, pizzas, sides, and beverages. The platform seamlessly bridges customer food ordering with kitchen dispatch workflows.

- **For Customers:** Provides an intuitive digital menu, customizable item configurations (sizes, extra toppings), dynamic location-based delivery fee calculations, persistent cart management, and real-time order tracking.
- **For Kitchen Staff & Admins:** Offers a real-time order management dashboard, dynamic menu availability toggles, deal/combo creation tools, operating hours management, and a blog publishing CMS.

---

## ✨ Key Features & Highlights

### 🛒 Customer Storefront
- **Dynamic Digital Menu:** Browse dishes filtered by category (*Burgers, Pizzas, Sides, Beverages, Desserts*) with instant search capabilities.
- **Item Customization:** Select item sizes (e.g., Small, Medium, Large) and add-on toppings with dynamic price updates.
- **Deals & Meal Combos:** Access curated promotional deal bundles with integrated savings highlights.
- **Location-Based Delivery System:** Automatic delivery zone validation (e.g., Gulgasht Zone, Cantt Zone, City Zone) with specific delivery fees, minimum order thresholds, and estimated arrival times.
- **Persistent Shopping Cart:** Context-driven shopping cart state with local storage persistence and quick item adjustments.
- **Real-Time Order Tracking:** Track orders by unique reference ID (`MELT9-XXXX`) with step-by-step progress history (`pending` ➔ `confirmed` ➔ `preparing` ➔ `ready` ➔ `out-for-delivery` ➔ `delivered`).
- **Store Availability Guard:** Dynamic open/close status indicator based on live operating hours and holiday schedules.

### 🍳 Kitchen Operations & Admin Portal (KMS)
- **Live Order Dispatch Queue:** Real-time stream of incoming customer orders filtered by kitchen preparation status.
- **Inventory & Menu Control:** Toggle item availability on the fly, edit prices, descriptions, and categories.
- **Deal Management:** Create, activate, and manage discounted meal combos and promotional bundles.
- **Operational Controls:** Configure regular store hours, holiday exceptions, and active delivery zones.
- **Content Management System:** Integrated blog engine for publishing promotional announcements and culinary news.

### 🔐 Security & Technical Design
- **Role-Based Access Control (RBAC):** Firebase Authentication coupled with granular Firestore Security Rules (`customer`, `kitchen`, `admin`).
- **SEO & Performance:** Optimized bundle chunking with Vite, semantic HTML5 structure, dynamic OpenGraph meta tags, and an automated XML sitemap generator.

---


## 🛠️ Tech Stack & Architecture

### **Frontend Framework & UI**
- **Core Library:** [React 19](https://react.dev/) with [TypeScript 5.9](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 7](https://vitejs.dev/) with Fast Refresh & ESM HMR
- **Routing:** [React Router v7](https://reactrouter.com/) (Client-side routing with role-based route guards)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) with PostCSS & Autoprefixer
- **UI Components & Icons:** [@headlessui/react](https://headlessui.com/), [@heroicons/react](https://heroicons.com/), [react-icons](https://react-icons.github.io/react-icons/)
- **UI Notifications:** [React Hot Toast](https://react-hot-toast.com/)

### **Backend & Cloud Platform (Firebase)**
- **Authentication:** Firebase Auth (Email/Password & Role Profiles)
- **Database:** Firebase Cloud Firestore (Real-time NoSQL database)
- **Security:** Granular Firestore Security Rules (`firestore.rules`) & Indexing (`firestore.indexes.json`)
- **Hosting:** Firebase Hosting with custom rewrites for Single Page Applications (SPA)

### **Developer & Utility Tooling**
- **Linting:** ESLint 9 with TypeScript & React Refresh rules
- **Database Seeding:** Node.js scripts using `firebase-admin` (`seed-menu.js`, `seed-deals.js`, `seed-blog.js`)
- **SEO Tooling:** Automated XML sitemap script (`generate-sitemap.js`)

---

## 🗄️ Firestore Database Schema Overview

```
cloud-firestore/
├── users/                # User authentication profiles & roles (customer, kitchen, admin)
├── menu/                 # Restaurant menu items, categories, pricing, sizes & add-ons
├── deals/                # Promotional combo deals and bundle packages
├── orders/               # Customer orders, status history, item breakdown & delivery details
├── blog/                 # Promotional blog articles and SEO content
├── hours_of_operation/   # Weekly store operating hours (Sun - Sat)
├── holiday_hours/        # Special operating schedules & holiday closures
└── delivery_zones/       # Location-based delivery areas, minimum order limits & delivery fees
```

---

## 🚀 Getting Started & Local Setup

Follow these steps to set up and run **Melt 9** on your local environment.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Firebase Project](https://console.firebase.google.com/) with Firestore & Authentication enabled.

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/the-melt-9.git
   cd the-melt-9
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of the project and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches Vite local development server with HMR. |
| `npm run build` | Generates sitemap and builds production bundle in `dist/`. |
| `npm run preview` | Serves local preview of production build artifacts. |
| `npm run lint` | Runs ESLint to check for code quality and syntax errors. |
| `npm run generate-sitemap` | Executes script to generate XML sitemap in `public/`. |
| `npm run seed-menu` | Seeds initial restaurant menu items to Firestore. |
| `npm run seed-deals` | Seeds promotional deals and combo bundles to Firestore. |
| `npm run seed-blog` | Seeds sample blog posts and announcements to Firestore. |

---

## 🌐 Deployment

This application is configured for seamless deployment to **Firebase Hosting**.

1. **Build the Production Application:**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase:**
   ```bash
   firebase deploy --only hosting
   ```

---

## 📄 License

This project is open-source and available under the **[MIT License](LICENSE)**.

---

<p center>
  Designed & Built for <strong>Melt 9 Gourmet Eatery</strong> 🍔🔥
</p>
