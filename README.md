# CampusCart 🎓🛒
> **A Smart, Verified Peer-to-Peer Engineering College Marketplace & Campus Hub**  
> Built as a full-stack **MERN** application compliant with **Web Application Development (WAD)** specifications using **React.js (Vite)**, **Node.js / Express.js**, **MongoDB / Mongoose**, **Tailwind CSS**, and **Bootstrap 5**.

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20%2B%20Bootstrap-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 Table of Contents
- [✨ Key Features](#-key-features)
- [🛡️ Dedicated Admin Command Center](#️-dedicated-admin-command-center)
- [🏛️ Engineering Departments Supported](#️-engineering-departments-supported)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [📁 Project Directory Structure](#-project-directory-structure)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [🔐 Test User & Admin Accounts](#-test-user--admin-accounts)
- [📡 API Endpoints Reference](#-api-endpoints-reference)
- [🗄️ MongoDB Database Schemas](#️-mongodb-database-schemas)
- [🎓 Academic Syllabus & GTU Compliance](#-academic-syllabus--gtu-compliance)
- [📄 License & Authors](#-license--authors)

---

## ✨ Key Features

### 1. 🎓 Role-Based Authentication & Privacy-First Security
- **Dual Role Access Control**: Clear switchable roles for **🎓 Student** and **🛡️ Campus Administrator / Faculty**.
- **Institutional Verification**: Account tagging with college email, engineering department, year of study, and student roll number.
- **Forgot Password Recovery**: 6-digit cryptographic verification code generation and password reset saved securely to MongoDB.
- **Clean Form UX**: Blank password fields by default with zero automatic pre-fills.

### 2. 🛒 Isolated Shopping Cart & Wishlist per User
- **Account Isolation**: Shopping carts and wishlist favorites are dynamically isolated per authenticated user session (`campuscart_cart_<email>`), ensuring zero data leakage across different user logins or guest sessions.

### 3. 🔔 Live Notifications & Alerts Bell
- **Real-Time Header Badge**: Unread notification counter in the top navigation bar.
- **Interactive Notification Dropdown**:
  - **`🛒 Purchase Request Received`**: Alerts sellers immediately when a buyer places an offer.
  - **`🎉 Order Accepted & Meetup Scheduled`**: Alerts buyers when the seller accepts their meetup proposal.
  - **`✅ Item Sold & Completed`**: Confirms transaction completion and ledger updates.
  - **`🎪 Event Registration Confirmation`**: Instant ticket confirmation alert.

### 4. 🗄️ Real-Time Sales Ledger & Purchase Orders Workflow
- **Multi-Account MongoDB Synchronization**:
  1. Student A posts a listing ➔ Stored in `products` collection with unique MongoDB `_id`.
  2. Student B logs in ➔ Discovers Student A's listing in the live campus marketplace.
  3. Student B sends purchase request ➔ Stored in `orders` collection (`status: "pending"`).
  4. Student A accepts & marks item **SOLD** ➔ Product status updates to `"sold"` and order to `"completed"`.
  5. Student B's **Dashboard ➔ My Purchases** displays the bought item with verified ownership.

### 5. 🚨 Safety & Abuse Reporting Loop
- **Student Report Drawer**: Flag suspicious or prohibited listings directly from the product detail modal with categories (e.g. *Misleading Price*, *Prohibited Item*, *Counterfeit*, *Spam*).
- **Direct Moderation Queue**: Reports are saved to MongoDB `/api/reports` and appear immediately in the **Admin Command Center** for investigation and resolution.

### 6. 🎟️ Dedicated Campus Events Hub & Digital QR Passes
- **Official Events Marketplace**: Standalone section for technical symposiums, hackathons, coding workshops, cultural fests, and sports tournaments.
- **Instant Digital QR Passport**: Students can register with 1-click and receive a digital ticket pass with a unique QR code and Ticket ID (e.g. `TKT-HACK-8921`) ready to download or print for entry.

### 7. 📢 Student Wanted Bulletin (In Search Of - ISO)
- **Live Peer Requirement Broadcast**: Post requests for out-of-stock items (specific textbook editions, mini-drafters, roller scales, Arduino kits).
- **Branch & Urgency Badges**: Filter requests by engineering department and urgency level (High / Medium / Normal).

### 8. 💬 In-App Peer Chat & Safe Meetup Spots
- **Direct Peer Messaging**: Negotiate prices, arrange item testing, and schedule campus meetups.
- **1-Click Meetup Chips**: Suggested daylight campus zones (*Central Library Lobby*, *Student Union Quad*, *Engineering Complex Foyer*, *Main Canteen*).

### 9. 🛡️ Interactive FAQ & Trust Center
- **Live Search & Filter Badges**: Search questions and filter by *Trust*, *Buying & Selling*, *Meetups*, *Pricing*, and *Events*.
- **Helpfulness Feedback**: Interactive voting (👍 / 👎) with actionable safety guidelines.

### 10. 🛡️ Anti-Spam Math CAPTCHA Widget
- Interactive arithmetic challenge preventing automated bot submissions when listing products or posting requirements (Module 7 security compliance).

---

## 🛡️ Dedicated Admin Command Center

Campus Administrators (`admin@campus.edu`) have a dedicated **Admin Command Center** (`activeTab === 'admin'`) with administrative controls separated from student views:

```mermaid
graph TD
    A[Admin Login: admin@campus.edu] --> B[Admin Command Center]
    B --> C[Executive Campus Metrics Cards]
    B --> D[Marketplace Moderation Queue]
    B --> E[Student & Staff User Directory]
    B --> F[Campus Events & Hackathons Manager]
    B --> G[Student Wanted Bulletin Moderation]
    B --> H[Trust & Safety / Abuse Reports Queue]
    
    D --> D1[One-Click Listing Removal from MongoDB]
    E --> E1[Suspend / Unsuspend Campus Accounts]
    F --> F1[Publish Official Events with Ticket Limits]
    H --> H1[Investigate & Resolve Student Reports]
```

- **Executive Analytics Overview**: Live MongoDB statistics for Total Users, Active Listings, Orders & Volume, Campus Events, and Safety Reports.
- **Marketplace Listings Moderation**: Search, filter by branch, and permanently remove problematic listings.
- **User Directory & Account Suspension**: View student emails, departments, ratings, and toggle suspension status.
- **Campus Events Hub**: Official administrative event creator with ticket capacities and scheduling.
- **Abuse Reports Queue**: View flagged listings/users and mark issues as resolved.

---

## 🏛️ Engineering Departments Supported

CampusCart is tailored for engineering universities and supports all 11 core disciplines:

| Branch Code | Department Name | Key Academic Essentials |
| :--- | :--- | :--- |
| **CS** | Computer Science & Engineering (CSE / CS) | DSA Guides, Dev Boards, Tech Books |
| **IT** | Information Technology (IT) | Web Dev, Networking, Cloud References |
| **AIML** | Artificial Intelligence & Machine Learning | Python, GPU Modules, Math Textbooks |
| **EC** | Electronics & Communication Engineering (ECE / EC) | Breadboards, Microcontrollers, DMMs |
| **ME** | Mechanical Engineering (ME) | Mini-Drafters, Roller Scales, Thermodynamics Guides |
| **EE** | Electrical Engineering (EE) | Transformer Kits, Multimeters, Circuit Guides |
| **IC** | Instrumentation & Control Engineering (IC) | Sensors, PLCs, Measurement Tools |
| **Auto** | Automobile Engineering | Mechanics Manuals, CAD Tools, Drafting Gear |
| **Civil** | Civil Engineering | Surveying Tools, Compass Sets, Steel Design Books |
| **Robo** | Robotics & Automation Engineering | Arduino / Raspberry Pi, Servos, Motor Drivers |
| **Env** | Environmental Engineering | Chemistry Kits, Hydrology Manuals, Ecology Guides |

---

## 🛠️ Tech Stack & Architecture

```mermaid
graph TD
    Client[React 18 + Vite Frontend] <-->|REST API / JSON| Server[Node.js + Express Backend]
    Client <-->|WebSocket Events| SocketIO[Socket.io Real-time Hub]
    Server <-->|Mongoose ODM| DB[(MongoDB Local / Atlas)]
    Server <-->|JWT Auth & RBAC| Security[Security & Middleware]
```

- **Frontend**: React 18, Vite, React-Bootstrap, Tailwind CSS, Lucide Icons, Material Symbols.
- **Backend**: Node.js, Express.js (MVC Architecture), CORS, Cookie Parser, Morgan.
- **Database**: MongoDB with Mongoose ODM (10+ Collections).
- **Authentication**: JWT (JSON Web Tokens), Bcrypt.js password hashing, Role-Based Access Control (RBAC).
- **State Management**: React Context API (`AppContext`) with dynamic local cache synchronization.

---

## 📁 Project Directory Structure

```
CampusCart/
├── frontend/                         # React Vite Single Page Application
│   ├── public/
│   │   ├── logo.svg                  # Custom CampusCart Graduation Cart Logo
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── CampusCartLogo.jsx     # Scalable Vector Brand Logo
│   │   │   │   ├── CaptchaWidget.jsx      # Math Anti-Spam Verification
│   │   │   │   ├── ScrollToTop.jsx        # Smooth Floating Scroll Button
│   │   │   │   └── ToastNotification.jsx  # Floating User Feedback Alerts
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx             # Top Navbar with Notification Dropdown & Admin Center
│   │   │   │   └── Footer.jsx             # Comprehensive SEO & Campus Links Footer
│   │   │   ├── modals/
│   │   │   │   ├── AddListingModal.jsx    # Add Product with CAPTCHA & Branch
│   │   │   │   ├── AuthModal.jsx          # Login/Signup/Forgot Password Modal
│   │   │   │   ├── CartModal.jsx          # Shopping Bag & Checkout Flow
│   │   │   │   ├── ChatModal.jsx          # Live Student Chat & Meetup Chips
│   │   │   │   ├── CreateEventModal.jsx   # Admin Event Creation Form
│   │   │   │   ├── EventTicketModal.jsx   # Digital QR Ticket Pass (Print/PDF)
│   │   │   │   ├── PostRequestModal.jsx   # Student Wanted ISO Requirement Form
│   │   │   │   ├── ProductDetailModal.jsx # Full Item Details, WhatsApp, Chat & Report Drawer
│   │   │   │   └── WishlistModal.jsx      # User Saved Items Overlay
│   │   │   └── pages/
│   │   │       ├── AdminPage.jsx          # Dedicated Admin Command Center Dashboard
│   │   │       ├── BrowsePage.jsx         # Catalog Search, Price Slider & Filters
│   │   │       ├── DiscoverPage.jsx       # Hero, Bento Grid, How It Works & FAQ
│   │   │       ├── EventsPage.jsx         # Dedicated Campus Events Hub
│   │   │       └── SellerHubPage.jsx      # Seller Metrics, Sales Orders & Purchased Items
│   │   ├── context/
│   │   │   └── AppContext.jsx             # Global State & User Isolation Logic
│   │   ├── services/
│   │   │   ├── api.js                     # Central Axios API Service
│   │   │   └── mockData.js                # Fallback Datasets & INR Prices
│   │   ├── App.jsx                        # Master Component Routing
│   │   ├── main.jsx                       # App Bootstrap Entry
│   │   └── index.css                      # Tailwind & Glassmorphism Styles
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                           # Express.js MongoDB API Server
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                      # MongoDB Connection Config
│   │   ├── controllers/
│   │   │   ├── adminController.js         # Admin Stats, User Management, Reports Queue
│   │   │   ├── authController.js          # Registration, Login, Role Sync, Forgot PW
│   │   │   ├── chatController.js          # Chat Conversations & Messages
│   │   │   ├── eventController.js         # Event CRUD & Ticket Booking
│   │   │   ├── notificationController.js  # User Notifications & Mark As Read
│   │   │   ├── orderController.js         # Purchase Requests, Accept, Mark Sold
│   │   │   ├── productController.js       # Product CRUD, Search & Filtering
│   │   │   ├── reportController.js        # Safety & Abuse Reports Submission
│   │   │   └── requirementController.js   # Student ISO Requirements
│   │   ├── middlewares/
│   │   │   ├── adminMiddleware.js         # adminOnly Access Guard
│   │   │   ├── authMiddleware.js          # JWT & Role Authorization (protect)
│   │   │   └── errorHandler.js            # Global Error Catcher
│   │   ├── models/
│   │   │   ├── Category.js                # Category Schema
│   │   │   ├── Chat.js                    # Chat Conversation Schema
│   │   │   ├── Event.js                   # Event & Attendee Schema
│   │   │   ├── Message.js                 # Chat Message Schema
│   │   │   ├── Notification.js            # User Notification Schema
│   │   │   ├── Order.js                   # Purchase Order Schema
│   │   │   ├── Product.js                 # Product Listing Schema
│   │   │   ├── Report.js                  # Safety Report Schema
│   │   │   ├── Requirement.js             # Student Wanted ISO Schema
│   │   │   └── User.js                    # User & Role Schema
│   │   ├── routes/
│   │   │   ├── adminRoutes.js             # /api/admin
│   │   │   ├── authRoutes.js              # /api/auth
│   │   │   ├── chatRoutes.js              # /api/chats
│   │   │   ├── eventRoutes.js             # /api/events
│   │   │   ├── notificationRoutes.js      # /api/notifications
│   │   │   ├── orderRoutes.js             # /api/orders
│   │   │   ├── productRoutes.js           # /api/products
│   │   │   ├── reportRoutes.js            # /api/reports
│   │   │   └── requirementRoutes.js       # /api/requirements
│   │   ├── utils/
│   │   │   └── seedData.js                # MongoDB Database Seeder
│   │   └── app.js                         # Express App Setup & Middleware
│   ├── server.js                          # Server Entry Point
│   ├── package.json
│   └── .env.example                       # Environment Variables Template
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/PreetDarji22/CampusCart.git
cd CampusCart
```

---

### Step 2: Setup & Start the Backend API Server
```bash
cd server

# Install backend dependencies
npm install

# (Optional) Seed initial campus data into MongoDB
npm run seed

# Start server in development mode (Runs on Port 5000)
npm run dev
```

The Express API will be live at `http://localhost:5000/api`.

---

### Step 3: Setup & Start the Frontend Client
Open a new terminal window:
```bash
cd CampusCart/frontend

# Install frontend dependencies
npm install

# Start Vite React development server (Runs on Port 3000)
npm run dev
```

Open **[http://localhost:3000/](http://localhost:3000/)** in your web browser.

---

## 🔐 Test User & Admin Accounts

When seeded, the following accounts are available for immediate testing:

| Role | Name | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- | :--- |
| **🎓 Student** | Alex Chen (CS) | `alex@campus.edu` | `password123` | Buy, Sell, Chat, Wishlist, Book Tickets |
| **🎓 Student** | Sarah Jenkins (IT) | `sarah@campus.edu` | `password123` | Buy, Sell, Chat, Wishlist, Book Tickets |
| **🛡️ Admin / Faculty** | Campus Administrator | `admin@campus.edu` | `password123` | **Full Admin Command Center**: Metrics, User Directory & Suspension, Marketplace Moderation, Event Publisher, Reports Queue |

> [!TIP]
> You can also register any new account instantly with your preferred engineering department.

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new student or admin account.
- `POST /api/auth/login` — Authenticate and receive JWT session.
- `POST /api/auth/forgot-password` — Generate 6-digit password reset code.
- `POST /api/auth/reset-password` — Verify code and save new hashed password.

### Products (`/api/products`)
- `GET /api/products` — Retrieve all listings with search, category, and department filters.
- `GET /api/products/:id` — Get detailed product specifications and seller profile.
- `POST /api/products` — Create a new listing (Authenticated).
- `PUT /api/products/:id` — Update listing or mark as SOLD.
- `DELETE /api/products/:id` — Remove listing.

### Orders & Sales (`/api/orders`)
- `GET /api/orders/my` — Fetch incoming sales orders and buyer purchase history.
- `POST /api/orders` — Create a new purchase request / offer.
- `PATCH /api/orders/:id/accept` — Accept buyer's purchase request.
- `PATCH /api/orders/:id/reject` — Reject buyer's purchase request.
- `PATCH /api/orders/:id/complete` — Mark transaction completed & item sold.

### Notifications (`/api/notifications`)
- `GET /api/notifications` — Fetch user notification feed.
- `PATCH /api/notifications/read-all` — Mark all notifications as read.
- `PATCH /api/notifications/:id/read` — Mark specific notification as read.

### Safety & Reports (`/api/reports`)
- `POST /api/reports` — Submit safety / fraud report for a listing.

### Admin Command Center (`/api/admin`)
- `GET /api/admin/stats` — Retrieve executive platform metrics.
- `GET /api/admin/users` — Fetch complete student/staff user directory.
- `PATCH /api/admin/users/:id/suspend` — Toggle account suspension status.
- `DELETE /api/admin/products/:id` — Administrative listing removal.
- `GET /api/admin/reports` — Retrieve moderation reports queue.
- `PATCH /api/admin/reports/:id/resolve` — Resolve or dismiss safety report.

### Campus Events Hub (`/api/events`)
- `GET /api/events` — Fetch all upcoming campus events and seat availability.
- `POST /api/events` — Create an official event posting (*Admin/Faculty Only*).
- `POST /api/events/:id/book` — Register and generate digital ticket passport.

### Student Wanted ISO (`/api/requirements`)
- `GET /api/requirements` — Fetch active student wanted requests.
- `POST /api/requirements` — Broadcast a new wanted gear requirement.

---

## 🗄️ MongoDB Database Schemas

- **`User`**: Name, Email, Password (bcrypt), Role (`student` / `admin`), Department, Avatar, RollNumber, Phone, isSuspended.
- **`Product`**: Title, Description, Price (INR), Category, Department, Condition, Images, Seller Ref, Status (`available` / `sold` / `removed`).
- **`Order`**: Product Ref, Buyer Ref, Seller Ref, OfferedPrice, Notes, Status (`pending` / `accepted` / `completed` / `rejected`).
- **`Notification`**: User Ref, Title, Message, Type, isRead, Timestamp.
- **`Report`**: Reporter Ref, TargetType, TargetId, Reason, Status (`pending` / `resolved`).
- **`Event`**: Title, Description, Category, Date, Time, Venue, Price, Capacity, RegisteredAttendees, Organizer Ref.
- **`Requirement`**: Title, Description, Department, Budget, Urgency, Requester Ref, Status.
- **`Chat & Message`**: Conversation Participants, Item Ref, Message Body, Timestamp, Read Status.

---

## 🎓 Academic Syllabus & GTU Compliance

CampusCart fulfills all requirements for **Web Application Development (GTU BE05000281)**:
- **Module 1 & 2**: HTML5 Semantic Structure, CSS3 Custom Properties, Responsive Layouts, Bootstrap Grid.
- **Module 3**: Client-side state synchronization, DOM manipulation, `localStorage` caching.
- **Module 4 & 5**: Node.js & Express.js RESTful API, MongoDB Mongoose schema design, MVC pattern.
- **Module 6**: Real-time communication and interactive UI components.
- **Module 7**: Anti-Spam Math CAPTCHA validation, JWT security, and Role-Based Access Control.

---

## 📄 License & Authors

This project is created for academic and educational purposes under the **MIT License**.

- **Author**: Preet Darji
- **Repository**: [https://github.com/PreetDarji22/CampusCart](https://github.com/PreetDarji22/CampusCart)

---
*Built with ❤️ for campus student communities.*
