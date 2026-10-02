# CampusCart 🎓🛒
> **A Modern Peer-to-Peer College Marketplace Web Application**  
> Built according to the **GTU Web Application Development (BE05000281)** Syllabus specifications using **React.js**, **React-Bootstrap**, **JavaScript (ES6+)**, **HTML5/CSS3**, **Axios**, **LocalStorage**, **Tailwind CSS**, and **Modern Web Concepts (SEO, Dark Mode & CAPTCHA)**.

---

## 📁 Repository Directory Structure

```
CampusCart/
├── frontend/                     # Full React.js Client Application
│   ├── public/                   # Static assets & favicons
│   ├── src/
│   │   ├── assets/               # Branding logos and graphics
│   │   ├── components/           # Reusable react-bootstrap UI components
│   │   │   ├── common/
│   │   │   │   ├── CaptchaWidget.jsx      # Module 7 Anti-Spam Math CAPTCHA
│   │   │   │   └── ToastNotification.jsx  # User action feedback alerts
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx             # Top bar with search, dark mode toggle, badges
│   │   │   │   └── Footer.jsx             # SEO footer with quick links
│   │   │   ├── modals/
│   │   │   │   ├── AddListingModal.jsx    # Scrollable modal with form & CAPTCHA
│   │   │   │   └── ProductDetailModal.jsx# Scrollable item details with WhatsApp/Email connect
│   │   │   └── pages/
│   │   │       ├── DiscoverPage.jsx       # Hero, category chips, & trending bento grid
│   │   │       ├── BrowsePage.jsx         # Catalog search, price slider, & filters
│   │   │       └── SellerHubPage.jsx      # Metrics dashboard & listing management
│   │   ├── context/
│   │   │   └── AppContext.jsx    # Global state management & Dark Mode/LocalStorage persistence
│   │   ├── services/
│   │   │   └── mockData.js       # Initial campus item datasets with INR (₹) prices
│   │   ├── App.jsx               # Main application component routing
│   │   ├── main.jsx              # React entry point with Bootstrap imports
│   │   └── index.css             # Tailwind directives & dark mode glassmorphic styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html                # SEO meta tags & Google Fonts
│
├── backend/                      # Upcoming Node.js / Express API Backend (Planned)
└── README.md
```

---

## ✅ Currently Implemented Frontend Features

### 1. **Campus-Cool Design System & Dark Mode Toggle**
- Integrated exact visual specifications from the **Stitch Immersive Visual Interface**:
  - **Colors**: Vibrant Indigo (`#6366F1`), Fresh Mint (`#10B981`), Sunny Amber (`#F59E0B`), Clean Light/Dark Background.
  - **Interactive Dark/Light Mode**: Toggle button in header (`sun`/`moon` icons) seamlessly switching between Light (`#FCF9F8`) and Dark Slate (`#0F172A`) themes with `localStorage` preference sync.
  - **Typography**: Paired **Geist** for display headlines with **Inter** for UI controls.
  - **Glassmorphism & Depth**: Ambient level shadows (`shadow-level-1/2/3`) and dark backdrop blur panels (`glass-card`).

### 2. **Localized INR Currency (₹)**
- All pricing, original comparisons, filter sliders, metric totals, and buyer messaging are formatted in **Indian Rupees (₹)**.

### 3. **Discover Landing Page**
- **Cinematic Hero Section**: Live campus activity indicator, gradient background, floating glassmorphic product cards, and call-to-action triggers.
- **Horizontal Category Chips**: Quick navigation by item category (Textbooks, Electronics, Dorm Essentials, Apparel, Music).
- **Asymmetric Bento Grid**: Trending items section featuring highlighted products, discount tags, and seller trust badges.

### 4. **Marketplace Catalog & Interactive Filters**
- **Live Search**: Instant keyword filtering across titles, descriptions, categories, and departments.
- **Sidebar Filter System**:
  - Filter by Category & Academic Department.
  - Interactive **Max Price Range Slider** (₹100 to ₹10,000).
  - **Verified Peers Only Switch** to show authenticated student sellers.
- **Price Sorting**: Sort items by Newest First, Price Low-to-High, and Price High-to-Low.

### 5. **Seller Hub Dashboard & Management**
- **Metrics Summary**: Real-time tracking of Total Sales (₹), Active Listings, Total Views, and Peer Response Rate.
- **Listing Actions**:
  - **Mark as Sold**: Instantly updates item status to SOLD.
  - **Delete Listing**: Removes items permanently from local state.
  - **View Details**: Opens full product modal overlay.

### 6. **Interactive Modals & Security Verification**
- **`ProductDetailModal`**: Displays high-res product preview, department, condition, seller profile, and direct **WhatsApp** & **Email** quick-connect action buttons.
- **`AddListingModal`**: Form validation with customizable photo URLs, department selection, and a scrollable body layout.
- **Anti-Spam CAPTCHA Widget**: Interactive Math challenge component to prevent automated spam listings before publishing (GTU Syllabus Module 7 requirement).

### 7. **Client-Side State Persistence**
- Synchronizes saved Theme preference, Wishlist items, Cart items, and User Listings with `browser localStorage` (GTU Syllabus Module 3 requirement).

---

## 🛠️ Implemented Backend Architecture & Tech Stack

| Module | Feature Target | Description | Status |
| :--- | :--- | :--- | :--- |
| **Module 5** | **Node.js & Express Server Setup** | Initialized `server/` with MVC architecture, CORS, Cookie Parser, Morgan logging, and central error handling. | ✅ Completed |
| **Module 5** | **RESTful API Endpoints** | Built complete CRUD endpoints for `/api/products`, `/api/categories`, `/api/orders`, `/api/wishlist`, `/api/chats`, `/api/reviews`, `/api/notifications`, `/api/admin`, and `/api/upload`. | ✅ Completed |
| **Module 5** | **Database Integration (MongoDB / Mongoose)** | Defined 10 Mongoose schemas (`User`, `Product`, `Category`, `Order`, `Wishlist`, `Chat`, `Message`, `Review`, `Notification`, `Report`). | ✅ Completed |
| **Module 5** | **Authentication & Security** | Implemented JWT-based access/refresh token pattern, password hashing with `bcryptjs`, and role-based middleware (`protect`, `adminOnly`). | ✅ Completed |
| **Module 5** | **Real-Time Communication** | Socket.io server integrated for real-time chat rooms (`chat:<id>`) and live notifications (`user:<id>`). | ✅ Completed |

---

## 💻 Running the Full MERN App Locally

### 1. Start Backend Express API (Port 5000)
```bash
# Navigate to backend server directory
cd CampusCart/server

# Install dependencies (if first time)
npm install

# Seed sample campus data into MongoDB
npm run seed

# Start server in development mode
npm run dev
```

### 2. Start Frontend React Client (Port 3000)
```bash
# Navigate to frontend directory
cd CampusCart/frontend

# Start Vite client
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to view CampusCart running with full database persistence!

