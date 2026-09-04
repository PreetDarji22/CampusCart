# CampusCart 🎓🛒
> **A Modern Peer-to-Peer College Marketplace Web Application**  
> Built according to the **GTU Web Application Development (BE05000281)** Syllabus specifications using **React.js**, **React-Bootstrap**, **JavaScript (ES6+)**, **HTML5/CSS3**, **Axios**, **LocalStorage**, **Tailwind CSS**, and **Modern Web Concepts (SEO & CAPTCHA)**.

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
│   │   │   │   ├── Navbar.jsx             # Top bar with search, badges, & navigation
│   │   │   │   └── Footer.jsx             # SEO footer with quick links
│   │   │   ├── modals/
│   │   │   │   ├── AddListingModal.jsx    # Scrollable modal with form & CAPTCHA
│   │   │   │   └── ProductDetailModal.jsx# Scrollable item details with WhatsApp/Email connect
│   │   │   └── pages/
│   │   │       ├── DiscoverPage.jsx       # Hero, category chips, & trending bento grid
│   │   │       ├── BrowsePage.jsx         # Catalog search, price slider, & filters
│   │   │       └── SellerHubPage.jsx      # Metrics dashboard & listing management
│   │   ├── context/
│   │   │   └── AppContext.jsx    # Global state management & LocalStorage persistence
│   │   ├── services/
│   │   │   └── mockData.js       # Initial campus item datasets with INR (₹) prices
│   │   ├── App.jsx               # Main application component routing
│   │   ├── main.jsx              # React entry point with Bootstrap imports
│   │   └── index.css             # Tailwind directives & glassmorphic styles
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

### 1. **Campus-Cool Design System & Aesthetics**
- Integrated exact visual specifications from the **Stitch Immersive Visual Interface**:
  - **Colors**: Vibrant Indigo (`#6366F1`), Fresh Mint (`#10B981`), Sunny Amber (`#F59E0B`), Clean Background (`#FCF9F8`).
  - **Typography**: Paired **Geist** for display headlines with **Inter** for UI controls.
  - **Glassmorphism & Depth**: Ambient level shadows (`shadow-level-1/2/3`) and backdrop blur panels (`glass-card`).

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
- Synchronizes saved Wishlist items, Cart items, and User Listings with `browser localStorage` (GTU Syllabus Module 3 requirement).

---

## 🛠️ Upcoming / Remaining Backend Features (Syllabus Roadmap)

| Module | Feature Target | Description | Status |
| :--- | :--- | :--- | :--- |
| **Module 5** | **Node.js & Express Server Setup** | Initialize `backend/` server, setup package dependencies, Express routing middleware, and environment configurations. | ⏳ Planned |
| **Module 5** | **RESTful API Endpoints** | Build CRUD endpoints for `/api/products`, `/api/categories`, `/api/user/listings`, and `/api/contact`. | ⏳ Planned |
| **Module 5** | **Database Integration (MongoDB / MySQL)** | Create database schemas (User, Product, Category, Order) with Mongoose / Sequelize ORM. | ⏳ Planned |
| **Module 5** | **Postman API Suite** | Create Postman testing collections for verifying HTTP request status codes and JSON payloads. | ⏳ Planned |
| **Module 5** | **Authentication & Security** | Implement JWT-based student login/registration, password hashing with `bcrypt`, and CORS middleware. | ⏳ Planned |

---

## 💻 Running the Frontend Locally

```bash
# 1. Navigate to the frontend directory
cd CampusCart/frontend

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npx vite --port 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the app!
