import React from 'react';
import { Navbar, Nav, Container, Form, InputGroup, Badge, Button } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';

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
    setIsAddListingOpen
  } = useApp();

  const onSearchSubmit = (e) => {
    e.preventDefault();
    handleSearchNav(searchQuery);
  };

  return (
    <Navbar
      fixed="top"
      className="bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl border-b border-border-subtle/50 z-50 py-2 shadow-sm"
    >
      <Container fluid className="px- margin-mobile md:px-margin-desktop">
        {/* Brand */}
        <Navbar.Brand
          onClick={() => setActiveTab('discover')}
          className="cursor-pointer font-display text-2xl font-bold tracking-tight text-primary dark:text-primary-fixed hover:opacity-90 transition-opacity"
        >
          Campus<span className="text-vibrant-indigo">Cart</span>
        </Navbar.Brand>

        {/* Desktop Search Bar */}
        <Form onSubmit={onSearchSubmit} className="hidden md:flex items-center relative w-72 lg:w-96 mx-4">
          <InputGroup className="rounded-full overflow-hidden border border-border-subtle bg-surface-container-low focus-within:border-vibrant-indigo focus-within:ring-1 focus-within:ring-vibrant-indigo transition-all">
            <InputGroup.Text className="bg-transparent border-0 text-outline pl-3 pr-1">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search campus marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 text-body-md text-on-surface focus:shadow-none py-2 pr-4 shadow-none"
            />
          </InputGroup>
        </Form>

        {/* Navigation Tabs */}
        <Nav className="hidden md:flex items-center space-x-6 mx-auto">
          <button
            onClick={() => setActiveTab('discover')}
            className={`font-label-md text-label-md transition-colors py-1 ${
              activeTab === 'discover'
                ? 'text-primary border-b-2 border-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`font-label-md text-label-md transition-colors py-1 ${
              activeTab === 'browse'
                ? 'text-primary border-b-2 border-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`font-label-md text-label-md transition-colors py-1 ${
              activeTab === 'seller'
                ? 'text-primary border-b-2 border-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Seller Hub
          </button>
        </Nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick List Item Button */}
          <Button
            onClick={() => setIsAddListingOpen(true)}
            className="hidden sm:flex items-center gap-1 bg-vibrant-indigo hover:bg-primary-container text-white border-0 font-label-md rounded-full px-4 py-2 text-sm shadow-level-1 hover:shadow-level-2 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Sell Item
          </Button>

          {/* Favorites/Wishlist Badge */}
          <button
            onClick={() => setActiveTab('browse')}
            className="p-2 text-on-surface-variant hover:bg-surface-container-high/60 rounded-full transition-all relative"
            title="Wishlist"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            {wishlist.length > 0 && (
              <Badge
                pill
                bg="danger"
                className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 text-[10px] bg-error-red px-1.5 py-0.5"
              >
                {wishlist.length}
              </Badge>
            )}
          </button>

          {/* Cart Icon & Counter */}
          <button
            onClick={() => setActiveTab('browse')}
            className="p-2 text-on-surface-variant hover:bg-surface-container-high/60 rounded-full transition-all relative"
            title="Shopping Cart"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cart.length > 0 && (
              <Badge
                pill
                className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 text-[10px] bg-fresh-mint text-white px-1.5 py-0.5"
              >
                {cart.length}
              </Badge>
            )}
          </button>

          {/* Profile Avatar */}
          <button
            onClick={() => setActiveTab('seller')}
            className="ml-2 w-9 h-9 rounded-full overflow-hidden border-2 border-surface-variant hover:border-vibrant-indigo transition-colors flex-shrink-0"
            title={`${currentUser.name} (${currentUser.department})`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </Container>
    </Navbar>
  );
};
