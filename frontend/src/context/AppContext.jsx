import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../services/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' | 'browse' | 'seller'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('campuscart_theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('campuscart_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('campuscart_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Products state with LocalStorage backup
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('campuscart_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Wishlist product IDs
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('campuscart_wishlist');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
  });

  // Cart items
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('campuscart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // User's own listings IDs
  const [myListingIds, setMyListingIds] = useState(() => {
    const saved = localStorage.getItem('campuscart_my_listings');
    return saved ? JSON.parse(saved) : ['prod-3', 'prod-5'];
  });

  // Modal & Toast states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', title: '' });

  // Current logged in student profile
  const [currentUser] = useState({
    name: 'Alex Chen',
    rollNumber: 'STAN-2024-8841',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz2CH0yYSHNS5GQy3djHi0aXKsO8QKdBz4I6pBw1zaxjtqJtmMjHAFMMaklFLHXwmljKi5BrtIldfhOJLPx3x4-SyIGsNLTpg2HUjBLNf-8rnhhPCWoiXgKRTFHxxxQwEbdyH7AzkMkcmc2slH-VaLYIO2kavjtCrqcCgUbs3LkanlKuU73c52ixKo8btomu72Wn18Eduwz0ZL9Spl81i9nbEuPKp_v0eTgVkVmC8-xc12fmKgi9YWcQ',
    verified: true,
    department: 'Computer Science',
    year: 'Senior (Year 4)',
    email: 'alex.chen@stanford.edu',
    phone: '+1 (650) 843-9210'
  });

  // Sync state changes to LocalStorage (Module 3 requirement)
  useEffect(() => {
    localStorage.setItem('campuscart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('campuscart_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('campuscart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('campuscart_my_listings', JSON.stringify(myListingIds));
  }, [myListingIds]);

  // Actions
  const triggerToast = (message, title = 'CampusCart Notice') => {
    setToast({ show: true, message, title });
    setTimeout(() => {
      setToast({ show: false, message: '', title: '' });
    }, 3500);
  };

  const toggleWishlist = (productId, e) => {
    if (e) e.stopPropagation();
    if (wishlist.includes(productId)) {
      setWishlist(prev => prev.filter(id => id !== productId));
      triggerToast('Removed item from your favorites', 'Wishlist Updated');
    } else {
      setWishlist(prev => [...prev, productId]);
      triggerToast('Saved item to your favorites!', 'Wishlist Updated');
    }
  };

  const addToCart = (product, e) => {
    if (e) e.stopPropagation();
    if (!cart.some(item => item.id === product.id)) {
      setCart(prev => [...prev, product]);
      triggerToast(`Added "${product.title}" to your cart.`, 'Cart Updated');
    } else {
      triggerToast(`"${product.title}" is already in your cart!`, 'Cart Notice');
    }
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    triggerToast('Item removed from cart', 'Cart Updated');
  };

  const addNewListing = (newProduct) => {
    const createdProduct = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      postedAt: 'Just now',
      views: 1,
      seller: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        verified: currentUser.verified,
        department: currentUser.department,
        year: currentUser.year,
        rating: 5.0,
        meetupLocation: newProduct.meetupLocation || 'Tressider Student Union'
      }
    };

    setProducts(prev => [createdProduct, ...prev]);
    setMyListingIds(prev => [createdProduct.id, ...prev]);
    triggerToast(`Listing for "${createdProduct.title}" is now LIVE on CampusCart!`, 'Listing Published');
  };

  const markAsSold = (productId) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, sold: true } : p));
    triggerToast('Item marked as SOLD! Congratulations on your sale.', 'Seller Hub');
  };

  const deleteListing = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setMyListingIds(prev => prev.filter(id => id !== productId));
    triggerToast('Listing permanently deleted.', 'Seller Hub');
  };

  const handleSearchNav = (query) => {
    setSearchQuery(query);
    setActiveTab('browse');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isDarkMode,
        toggleDarkMode,
        products,
        wishlist,
        cart,
        myListingIds,
        currentUser,
        selectedProduct,
        setSelectedProduct,
        isAddListingOpen,
        setIsAddListingOpen,
        toast,
        triggerToast,
        toggleWishlist,
        addToCart,
        removeFromCart,
        addNewListing,
        markAsSold,
        deleteListing,
        handleSearchNav
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
