# CampusCart 🎓🛒
> **A Modern College Campus Marketplace Web Application**
> Built according to the **GTU Web Application Development (BE05000281)** Syllabus specifications using **React.js**, **React-Bootstrap**, **JavaScript (ES6+)**, **HTML5/CSS3**, **Axios**, **LocalStorage**, and **Modern Web Concepts (SEO & CAPTCHA)**.

---

## 📌 Frontend End-to-End Implementation Plan

CampusCart is a modern, responsive peer-to-peer college marketplace designed specifically for students to buy, sell, rent, and trade campus essentials (textbooks, electronics, lab gear, study notes, and dorm items).

---

## 🛠️ Technology Stack & Syllabus Alignment

| Syllabus Module | Technologies Included | CampusCart Usage |
| :--- | :--- | :--- |
| **Module 2: HTML & CSS Fundamentals** | HTML5 Semantic Tags, Forms, CSS Flexbox/Grid, Responsive Design, Bootstrap | Semantic markup, custom styling, dynamic Flexbox/Grid catalog layout, `react-bootstrap` UI components (`Navbar`, `Modal`, `Card`, `Badge`, `Toast`, `Form`, `Container`, `Row`, `Col`, `Button`). |
| **Module 3: JavaScript Fundamentals** | ES6+ Syntax, DOM Manipulation, LocalStorage, Promises, Async/Await, Fetch API | Client-side state persistence (user session, cart, wishlist), asynchronous mock backend calls, event handling, dynamic UI updates. |
| **Module 4: APIs & HTTP Communication** | HTTP Methods, Status Codes, JSON Data, REST API integration using Fetch/Axios | Centralized API client using Axios/Fetch with JSON payload parsing and fallback mock datasets. |
| **Module 6: Frontend Development with React.js** | React.js (Vite), Functional Components, JSX, `useState`, `useEffect`, `useContext`, Conditional & List Rendering | Modular component hierarchy with `react-bootstrap`, dynamic listing filtering, reactive cart/wishlist management, stateful form controls. |
| **Module 7: Deployment & Modern Web Concepts** | SEO Meta Tags, Responsive UI, CAPTCHA Concepts, Modern Web Design | Built-in listing verification (Interactive Math/Pattern CAPTCHA widget), SEO-optimized headers, theme toggler (Dark/Light). |

---

## 🎨 Architecture & Directory Structure

```
CampusCart/
└── frontend/
    ├── public/
    │   ├── favicon.ico
    │   └── assets/
    ├── src/
    │   ├── assets/                # Logos, category icons, sample placeholder images
    │   ├── components/            # Reusable UI Components (Using react-bootstrap)
    │   │   ├── layout/
    │   │   │   ├── AppNavbar.jsx   # react-bootstrap Navbar with search, nav links, cart badge & theme toggle
    │   │   │   └── AppFooter.jsx   # Footer with quick links & SEO information
    │   │   ├── common/
    │   │   │   ├── CustomBadge.jsx # Condition/Category indicator badges (react-bootstrap Badge)
    │   │   │   ├── CaptchaWidget.jsx # Anti-spam verification for post listings (Module 7)
    │   │   │   ├── ActionToast.jsx # Feedback alerts using react-bootstrap Toast
    │   │   │   └── ConfirmationModal.jsx # react-bootstrap Modal overlay
    │   │   ├── marketplace/
    │   │   │   ├── ProductCard.jsx # react-bootstrap Card with price, seller tag, quick actions
    │   │   │   ├── ProductGrid.jsx # react-bootstrap Container/Row/Col grid layout
    │   │   │   ├── FilterSidebar.jsx # Category, price range, and condition filter controls
    │   │   │   └── ProductDetailModal.jsx # Detailed modal view with seller contact & image preview
    │   │   └── listing/
    │   │       └── AddListingModal.jsx # react-bootstrap Form modal with HTML validation & CAPTCHA
    │   ├── context/
    │   │   ├── AuthContext.jsx    # React Context for student session state & LocalStorage sync
    │   │   ├── CartContext.jsx    # React Context for Cart & Saved Wishlist management
    │   │   └── ThemeContext.jsx   # React Context for Dark / Light theme toggling
    │   ├── services/
    │   │   ├── api.js             # Axios client instance configured for REST communication
    │   │   └── mockData.js        # Rich initial product dataset (Books, Tech, Notes, Gear)
    │   ├── styles/
    │   │   ├── custom.css         # Bootstrap overrides, CSS variables, glassmorphism UI
    │   │   └── animations.css     # Micro-interactions, hover effects, transition classes
    │   ├── App.jsx                # Main application component & layout routing
    │   ├── main.jsx               # React entrypoint mounting Bootstrap CSS & Context Providers
    │   └── index.html             # HTML5 base document with SEO meta tags & Google Fonts
    ├── package.json
    └── vite.config.js
```

---

## 🌟 Key Application Features

### 1. **Campus Marketplace Feed & Filters**
- **Interactive Search Bar**: Real-time filtering by item title, author, course code, or keyword.
- **Category Filter Pills**: Textbooks, Lab Equipment, Electronics/Gadgets, Study Notes, Campus Essentials.
- **Sort & Range Selectors**: Sort by Price (Low to High, High to Low), Date Listed, Condition (New, Like New, Fair).
- **Responsive Layout**: Fluid grid using `react-bootstrap` Grid components (`Container`, `Row`, `Col`).

### 2. **Product Detail View & Quick Seller Connect**
- Detailed item description, college department, semester relevance, original vs discounted price.
- Direct **WhatsApp / Email quick connect button** pre-filled with listing title.
- Seller trust rating & verified campus identity badge.

### 3. **Interactive "Sell Item" Form with CAPTCHA**
- `react-bootstrap` Form with validation for required fields (Title, Category, Price, Department, Seller Info).
- Image preview URL loader.
- **CAPTCHA Verification Component** (Module 7 requirement): Math challenge / code input to prevent spam listings before submission.

### 4. **Reactive Shopping Cart & Wishlist Drawer**
- Persistent wishlist and cart stored in `browser localStorage` (Module 3 requirement).
- Dynamic subtotal calculation with conditional rendering for empty states.
- Quick checkout/request quote summary modal.

### 5. **Student Authentication & Profile (Client Simulation)**
- Student login/signup modal with campus roll number and department.
- "My Active Listings" tab with options to mark items as **SOLD** or **DELETED**.

---

## 📋 Step-by-Step Implementation Strategy

### Phase 1: Foundation & Project Setup
1. **Initialize React App**: Run `npm create vite@latest frontend -- --template react` inside `CampusCart/`.
2. **Install Core Dependencies**: `bootstrap`, `react-bootstrap`, `axios`, `lucide-react`.
3. **Setup CSS & Bootstrap System**: Import `bootstrap/dist/css/bootstrap.min.css` in `main.jsx`, define CSS custom properties for dark/light themes, and glassmorphism utilities.

### Phase 2: State Management & LocalStorage Services
1. **`mockData.js`**: Create a comprehensive dataset of campus items with images, prices, departments, tags.
2. **`AuthContext.jsx`**: Implement mock student login, store profile info in `localStorage`.
3. **`CartContext.jsx`**: Manage added cart items & wishlist with sync hooks to `localStorage`.
4. **`api.js`**: Configure Axios instance targeting backend URL (`http://localhost:5000/api`) with fallback to local state if backend is offline.

### Phase 3: Component Assembly & UI Development (react-bootstrap)
1. **Navbar & Footer**: `react-bootstrap` Navbar with dynamic counter badges for Cart/Wishlist items and theme switch button.
2. **Catalog & Filtering System**: Implement `ProductCard`, `ProductGrid`, and sidebar filters using React state hooks (`useState`, `useMemo`).
3. **Listing Creation & CAPTCHA**: Build `AddListingModal` using `react-bootstrap` Modal & Form with field validation, live photo preview, and CAPTCHA challenge component.
4. **Product Detail Modal**: Show deep-dive details, seller info, and direct interaction buttons.
5. **Toast Notifications**: Build interactive alerts using `react-bootstrap` `ToastContainer` and `Toast`.

### Phase 4: Polish, Responsiveness & Modern Web Concepts
1. **SEO Optimization**: Inject structured HTML meta tags, OpenGraph tags, semantic headers (`h1`, `header`, `nav`, `main`, `footer`).
2. **Dark/Light Theme Toggle**: Seamless transition between dark and light themes using CSS variables and React Context.
3. **Responsive Testing**: Verify flawless rendering across Mobile (375px), Tablet (768px), and Desktop (1200px+) viewports.

---

## 🧪 Verification & Testing Plan

### Automated & Linting Checks
- Executing `npm run build` to verify zero bundle errors, clean React JSX compilation, and correct CSS imports.

### Manual Functional Testing Checklist
1. **Catalog Search & Filter**: Verify typing in search box filters items instantly; switching category filter updates item grid.
2. **Add Listing Flow**: Test form validation with missing fields, enter invalid CAPTCHA (should block submission), enter correct CAPTCHA (should add listing to grid & update view).
3. **Cart & Wishlist Persistence**: Add items to cart/wishlist, refresh browser, ensure items persist via `localStorage`.
4. **Seller Contact Trigger**: Click "Contact Seller via WhatsApp/Email" and verify generated URI scheme.
5. **Theme Switcher**: Click Dark/Light toggle and confirm smooth visual transition.

