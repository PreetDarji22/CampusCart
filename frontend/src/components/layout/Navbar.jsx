import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Home,
  Store,
  Calendar,
  LayoutGrid,
  PlusCircle,
  Moon,
  Sun,
  Heart,
  ShoppingCart,
  ChevronDown,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CampusCartLogo } from '../common/CampusCartLogo';

export const AppNavbar = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    handleSearchNav,
    wishlist,
    cart,
    currentUser,
    isAuthenticated,
    logoutUser,
    requireAuth,
    setIsAddListingOpen,
    setIsAuthOpen,
    setIsCartOpen,
    setIsWishlistOpen,
    isDarkMode,
    toggleDarkMode
  } = useApp();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearchNav(searchQuery);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSellerClick = () => {
    requireAuth(() => setActiveTab('seller'));
    setIsMobileMenuOpen(false);
  };

  const handleSellItemClick = () => {
    requireAuth(() => setIsAddListingOpen(true));
    setIsMobileMenuOpen(false);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 py-2.5 transition-all">
      <div className="max-w-[1720px] mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl lg:rounded-full shadow-sm px-4 sm:px-6 py-2 flex items-center justify-between gap-3 lg:gap-4 xl:gap-6">
        
        {/* 1. CampusCart logo/branding */}
        <div
          onClick={() => handleTabClick('discover')}
          className="cursor-pointer flex items-center gap-2.5 flex-shrink-0 select-none group"
        >
          <CampusCartLogo size={38} isCircle={true} />
          <div className="flex flex-col">
            <span className="font-display text-lg lg:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              Campus<span className="text-[#3b82f6] dark:text-[#60a5fa]">Cart</span>
            </span>
            <span className="text-[9px] font-bold tracking-[0.16em] text-slate-400 dark:text-slate-400 uppercase leading-tight mt-0.5">
              BUY · SELL · CONNECT
            </span>
          </div>
        </div>

        {/* 2. Search bar (Desktop) */}
        <form
          onSubmit={onSearchSubmit}
          className="hidden md:flex items-center flex-1 max-w-[240px] lg:max-w-[280px] xl:max-w-[340px] min-w-[180px]"
        >
          <div className="w-full flex items-center bg-[#f1f4f9] dark:bg-slate-800/90 rounded-full px-3.5 py-2 border border-slate-200/80 dark:border-slate-700/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Search items, events, sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-xs lg:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-0 p-0"
            />
          </div>
        </form>

        {/* 3. Navigation links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Discover */}
          <button
            type="button"
            onClick={() => handleTabClick('discover')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs xl:text-sm transition-all cursor-pointer ${
              activeTab === 'discover'
                ? 'bg-[#eef2ff] dark:bg-indigo-950/70 text-[#4338ca] dark:text-indigo-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 font-medium'
            }`}
          >
            <Home className={`w-4 h-4 ${activeTab === 'discover' ? 'fill-current' : ''}`} />
            <span>Discover</span>
          </button>

          {/* Marketplace */}
          <button
            type="button"
            onClick={() => handleTabClick('browse')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs xl:text-sm transition-all cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-[#eef2ff] dark:bg-indigo-950/70 text-[#4338ca] dark:text-indigo-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 font-medium'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Marketplace</span>
          </button>

          {/* Events */}
          <button
            type="button"
            onClick={() => handleTabClick('events')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs xl:text-sm transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-[#eef2ff] dark:bg-indigo-950/70 text-[#4338ca] dark:text-indigo-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 font-medium'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Events</span>
          </button>

          {/* Dashboard */}
          <button
            type="button"
            onClick={handleSellerClick}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs xl:text-sm transition-all cursor-pointer ${
              activeTab === 'seller'
                ? 'bg-[#eef2ff] dark:bg-indigo-950/70 text-[#4338ca] dark:text-indigo-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 font-medium'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </nav>

        {/* Divider between Dashboard and Sell Item (Desktop) */}
        <div className="hidden lg:block h-6 w-px bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

        {/* 4. SELL ITEM BUTTON */}
        <button
          type="button"
          onClick={handleSellItemClick}
          className="h-11 px-4 sm:px-5 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] hover:from-[#2563eb] hover:to-[#4338ca] text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all active:scale-[0.98] flex-shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 flex-shrink-0" />
          <span className="whitespace-nowrap font-medium tracking-tight">Sell Item</span>
        </button>

        {/* 5. Right-side controls */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Wishlist/heart icon */}
          <button
            type="button"
            onClick={() => setIsWishlistOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors cursor-pointer"
            title="Wishlist"
            aria-label="View wishlist"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          {/* Cart icon with item-count badge */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors cursor-pointer"
            title="Shopping Cart"
            aria-label="View shopping cart"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#2563eb] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {cart.length}
              </span>
            )}
          </button>

          {/* User avatar/profile dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileDropdownOpen(prev => !prev)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
              title={isAuthenticated ? currentUser?.name : "Student Account"}
              aria-label="User profile menu"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser?.name || "User Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <circle cx="18" cy="18" r="18" fill="#DBEAFE"/>
                    <path d="M15 22 H21 V26 H15 Z" fill="#FDE047" opacity="0.6" />
                    <circle cx="18" cy="16" r="6" fill="#FCD34D"/>
                    <path d="M13 15 C13 11 15 9 18 9 C21 9 23 11 23 15 C23 13 22 11 20 11 C18 11 17 11 15 12 C14 12.5 13 13.5 13 15 Z" fill="#1E293B"/>
                    <circle cx="16" cy="15.5" r="0.9" fill="#1E293B"/>
                    <circle cx="20" cy="15.5" r="0.9" fill="#1E293B"/>
                    <path d="M16.5 18 Q18 19.2 19.5 18" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" fill="none"/>
                    <path d="M9 34 C9 27.5 13 24.5 18 24.5 C23 24.5 27 27.5 27 34 Z" fill="#2563EB"/>
                    <path d="M15 24.5 L18 27 L21 24.5" stroke="#FFFFFF" strokeWidth="1" fill="none"/>
                  </svg>
                )}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 py-2 z-50">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                          {currentUser?.name || 'Campus Student'}
                        </span>
                        {currentUser?.role === 'admin' && (
                          <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {currentUser?.email || 'student@college.edu'}
                      </p>
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate mt-0.5">
                        {currentUser?.department || 'Student Member'}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('seller');
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LayoutGrid className="w-4 h-4 text-slate-400" />
                        <span>Student Dashboard</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddListingOpen(true);
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4 text-slate-400" />
                        <span>Sell an Item</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsWishlistOpen(true);
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        <span>Wishlist ({wishlist.length})</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCartOpen(true);
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4 text-slate-400" />
                        <span>Cart ({cart.length})</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          logoutUser();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-3">
                    <div className="px-1 py-1 mb-2">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">CampusCart Account</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Sign in with verified college email</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAuthOpen(true);
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Login / Register</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-[1720px] mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-lg p-4 space-y-3">
          {/* Mobile Search Input */}
          <form onSubmit={onSearchSubmit} className="w-full">
            <div className="flex items-center bg-[#f1f4f9] dark:bg-slate-800/90 rounded-full px-3.5 py-2 border border-slate-200/80 dark:border-slate-700/80">
              <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search items, events, sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-0 p-0"
              />
            </div>
          </form>

          {/* Mobile Nav Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleTabClick('discover')}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'discover'
                  ? 'bg-[#eef2ff] dark:bg-indigo-950/70 text-[#4338ca] dark:text-indigo-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Discover</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('browse')}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'browse'
                  ? 'bg-[#eef2ff] dark:bg-indigo-950/70 text-[#4338ca] dark:text-indigo-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Marketplace</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('events')}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'events'
                  ? 'bg-[#eef2ff] dark:bg-indigo-950/70 text-[#4338ca] dark:text-indigo-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </button>
            <button
              type="button"
              onClick={handleSellerClick}
              className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'seller'
                  ? 'bg-[#eef2ff] dark:bg-indigo-950/70 text-[#4338ca] dark:text-indigo-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
