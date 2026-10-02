import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Badge, Button } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, DEPARTMENTS } from '../../services/mockData';

export const BrowsePage = () => {
  const {
    products,
    requests = [],
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setSelectedProduct,
    toggleWishlist,
    wishlist,
    setIsAddListingOpen,
    setIsPostRequestOpen,
    openChatWith
  } = useApp();

  const [browseMode, setBrowseMode] = useState('listings'); // 'listings' | 'requests'
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [maxPrice, setMaxPrice] = useState(25000);
  const [sortBy, setSortBy] = useState('newest');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);

  const resetAllFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedDept('All Departments');
    setMaxPrice(25000);
    setSearchQuery('');
    setVerifiedOnly(false);
    setUrgentOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'All Categories' ||
    selectedDept !== 'All Departments' ||
    maxPrice < 25000 ||
    verifiedOnly ||
    urgentOnly ||
    searchQuery.trim().length > 0;

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      const itemDept = item.department || item.seller?.department || 'General';
      const itemCat = item.category || 'Misc';

      if (selectedCategory !== 'All Categories' && itemCat !== selectedCategory) {
        return false;
      }
      if (selectedDept !== 'All Departments' && itemDept !== selectedDept) {
        return false;
      }
      if (item.price > maxPrice) {
        return false;
      }
      if (verifiedOnly && !item.seller?.verified) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (item.title || '').toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesCategory = itemCat.toLowerCase().includes(q);
        const matchesDept = itemDept.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesCategory || matchesDept;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [products, selectedCategory, selectedDept, maxPrice, verifiedOnly, searchQuery, sortBy]);

  // Filtered Student Requests
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const reqDept = req.department || req.postedBy?.department || 'General';
      const reqCat = req.category || 'Misc';

      if (selectedCategory !== 'All Categories' && reqCat !== selectedCategory) {
        return false;
      }
      if (selectedDept !== 'All Departments' && reqDept !== selectedDept) {
        return false;
      }
      if (urgentOnly && !req.urgent) {
        return false;
      }
      if (verifiedOnly && !req.postedBy?.verified) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (req.title || '').toLowerCase().includes(q);
        const matchesDesc = (req.description || '').toLowerCase().includes(q);
        const matchesCategory = reqCat.toLowerCase().includes(q);
        const matchesDept = reqDept.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesCategory || matchesDept;
      }
      return true;
    });
  }, [requests, selectedCategory, selectedDept, urgentOnly, verifiedOnly, searchQuery]);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <Container maxwidth="7xl">
        {/* Mode Switcher Tabs */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
          <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-border-subtle w-fit">
            <button
              onClick={() => setBrowseMode('listings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                browseMode === 'listings'
                  ? 'bg-vibrant-indigo text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-background'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              Marketplace Listings ({filteredProducts.length})
            </button>

            <button
              onClick={() => setBrowseMode('requests')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                browseMode === 'requests'
                  ? 'bg-vibrant-indigo text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-background'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">campaign</span>
              Student Wanted Requests ({filteredRequests.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {browseMode === 'listings' ? (
              <Button
                onClick={() => setIsAddListingOpen(true)}
                className="bg-vibrant-indigo hover:bg-primary-container text-white text-xs font-semibold px-4 py-2 rounded-xl border-0 shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                Sell an Item
              </Button>
            ) : (
              <Button
                onClick={() => setIsPostRequestOpen(true)}
                className="bg-fresh-mint hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-xl border-0 shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                Post a Requirement
              </Button>
            )}
          </div>
        </div>

        {/* Search & Results Header */}
        <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-background">
              {searchQuery
                ? `Search: "${searchQuery}"`
                : browseMode === 'listings'
                ? 'Campus Marketplace Feed'
                : 'Student Requirements & Wanted Feed'}
            </h1>
            <p className="text-xs sm:text-sm text-outline mb-0 mt-1">
              {browseMode === 'listings'
                ? `Showing ${filteredProducts.length} verified physical items for sale near your campus`
                : `Showing ${filteredRequests.length} peer requests from students needing items`}
            </p>
          </div>

          {browseMode === 'listings' && (
            <div className="flex items-center gap-3">
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold py-2 px-3 rounded-xl border-border-subtle bg-surface-card w-44"
              >
                <option value="newest">Sort by: Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </Form.Select>
            </div>
          )}
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2 p-3 bg-surface-container-low rounded-xl border border-border-subtle">
            <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1 mr-1">
              <span className="material-symbols-outlined text-[16px] text-vibrant-indigo">filter_alt</span>
              Active Filters:
            </span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-surface-card border border-border-subtle text-xs font-medium px-2.5 py-1 rounded-lg text-on-background">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="text-outline hover:text-error-red">✕</button>
              </span>
            )}

            {selectedCategory !== 'All Categories' && (
              <span className="inline-flex items-center gap-1 bg-surface-card border border-border-subtle text-xs font-medium px-2.5 py-1 rounded-lg text-on-background">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All Categories')} className="text-outline hover:text-error-red">✕</button>
              </span>
            )}

            {selectedDept !== 'All Departments' && (
              <span className="inline-flex items-center gap-1 bg-surface-card border border-border-subtle text-xs font-medium px-2.5 py-1 rounded-lg text-on-background">
                Dept: {selectedDept}
                <button onClick={() => setSelectedDept('All Departments')} className="text-outline hover:text-error-red">✕</button>
              </span>
            )}

            {browseMode === 'listings' && maxPrice < 25000 && (
              <span className="inline-flex items-center gap-1 bg-surface-card border border-border-subtle text-xs font-medium px-2.5 py-1 rounded-lg text-on-background">
                Price ≤ ₹{maxPrice.toLocaleString('en-IN')}
                <button onClick={() => setMaxPrice(25000)} className="text-outline hover:text-error-red">✕</button>
              </span>
            )}

            {verifiedOnly && (
              <span className="inline-flex items-center gap-1 bg-surface-card border border-border-subtle text-xs font-medium px-2.5 py-1 rounded-lg text-on-background">
                Verified Only
                <button onClick={() => setVerifiedOnly(false)} className="text-outline hover:text-error-red">✕</button>
              </span>
            )}

            {browseMode === 'requests' && urgentOnly && (
              <span className="inline-flex items-center gap-1 bg-error-container text-error text-xs font-medium px-2.5 py-1 rounded-lg">
                Urgent Only
                <button onClick={() => setUrgentOnly(false)} className="text-error hover:text-red-700">✕</button>
              </span>
            )}

            <button
              onClick={resetAllFilters}
              className="text-xs font-bold text-vibrant-indigo hover:underline ml-auto"
            >
              Reset All
            </button>
          </div>
        )}

        <Row className="g-4">
          {/* Filter Sidebar */}
          <Col lg={3} md={4}>
            <div className="bg-surface-card p-4 rounded-2xl border border-border-subtle shadow-level-1 sticky top-24 space-y-5">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <h3 className="font-label-md text-base font-bold text-on-background flex items-center gap-2 mb-0">
                  <span className="material-symbols-outlined text-vibrant-indigo">tune</span>
                  Filters
                </h3>
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-vibrant-indigo hover:underline font-medium"
                >
                  Reset
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-xs font-bold text-on-background uppercase tracking-wider mb-2 block">
                  Category
                </label>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-vibrant-indigo text-white font-semibold'
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Department Filter */}
              <div>
                <label className="text-xs font-bold text-on-background uppercase tracking-wider mb-2 block">
                  Academic Department
                </label>
                <Form.Select
                  size="sm"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="text-xs rounded-lg"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </Form.Select>
              </div>

              {/* Mode-specific filters */}
              {browseMode === 'listings' ? (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-on-background uppercase tracking-wider mb-0">
                      Max Price
                    </label>
                    <span className="text-xs font-bold text-vibrant-indigo">₹{maxPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <Form.Range
                    min={100}
                    max={25000}
                    step={250}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                </div>
              ) : (
                <div>
                  <Form.Check
                    type="switch"
                    id="urgent-filter-switch"
                    label={
                      <span className="text-xs font-semibold text-on-background flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-error-red">timer</span>
                        Urgent Requirements Only
                      </span>
                    }
                    checked={urgentOnly}
                    onChange={(e) => setUrgentOnly(e.target.checked)}
                  />
                </div>
              )}

              {/* Verified Peer Toggle */}
              <div className="pt-2 border-t border-border-subtle">
                <Form.Check
                  type="switch"
                  id="verified-switch"
                  label={
                    <span className="text-xs font-semibold text-on-background flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-fresh-mint">verified</span>
                      Verified Peers Only
                    </span>
                  }
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                />
              </div>
            </div>
          </Col>

          {/* Main Content Area */}
          <Col lg={9} md={8}>
            {browseMode === 'listings' ? (
              // PRODUCTS GRID
              filteredProducts.length === 0 ? (
                <div className="bg-surface-card p-10 rounded-2xl text-center border border-border-subtle shadow-sm my-4">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
                  <h3 className="font-headline-md text-lg font-bold text-on-background">No Campus Listings Found</h3>
                  <p className="text-sm text-outline max-w-md mx-auto mt-1 mb-4">
                    Can't find what you're looking for? Post a student requirement so peers with this item can contact you!
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={resetAllFilters}
                      className="rounded-xl px-4"
                    >
                      Clear Filters
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsPostRequestOpen(true)}
                      className="bg-vibrant-indigo text-white border-0 rounded-xl px-4"
                    >
                      + Post Student Requirement
                    </Button>
                  </div>
                </div>
              ) : (
                <Row className="g-4">
                  {filteredProducts.map(prod => {
                    const isLiked = wishlist.includes(prod.id);
                    return (
                      <Col key={prod.id} lg={4} sm={6}>
                        <Card
                          onClick={() => setSelectedProduct(prod)}
                          className="h-full border-0 rounded-2xl overflow-hidden shadow-level-1 hover:shadow-level-2 transition-all group cursor-pointer bg-surface-card"
                        >
                          <div className="h-48 overflow-hidden relative bg-surface-container-low">
                            <Card.Img
                              variant="top"
                              src={prod.image}
                              alt={prod.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <button
                              onClick={(e) => toggleWishlist(prod.id, e)}
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-outline hover:text-error-red transition-colors shadow-sm"
                              title="Add to Favorites"
                            >
                              <span className={`material-symbols-outlined text-[18px] ${isLiked ? 'text-error-red filled' : ''}`}>
                                favorite
                              </span>
                            </button>

                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-white font-medium">
                              {prod.condition}
                            </div>
                          </div>

                          <Card.Body className="p-3.5 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-1">
                                <Card.Title className="text-sm font-bold font-label-md text-on-background line-clamp-1 mb-0">
                                  {prod.title}
                                </Card.Title>
                              </div>

                              <p className="text-xs text-outline mb-2">
                                {prod.department}
                              </p>

                              <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                                {prod.description}
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center justify-between border-t border-border-subtle pt-2">
                                <div className="flex items-baseline gap-1">
                                  <span className="text-base font-bold text-on-background">₹{prod.price.toLocaleString('en-IN')}</span>
                                  {prod.originalPrice && (
                                    <span className="text-xs text-outline line-through">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1 text-xs text-outline">
                                  <span>{prod.seller?.name || 'Peer'}</span>
                                  {prod.seller?.verified && (
                                    <span className="material-symbols-outlined text-[15px] text-fresh-mint" title="Verified Peer">
                                      verified
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              )
            ) : (
              // STUDENT REQUESTS GRID
              filteredRequests.length === 0 ? (
                <div className="bg-surface-card p-10 rounded-2xl text-center border border-border-subtle shadow-sm my-4">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">campaign</span>
                  <h3 className="font-headline-md text-lg font-bold text-on-background">No Student Requirements Found</h3>
                  <p className="text-sm text-outline max-w-md mx-auto mt-1 mb-4">
                    Be the first student to post what you need for this semester!
                  </p>
                  <Button
                    onClick={() => setIsPostRequestOpen(true)}
                    className="bg-fresh-mint hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-xl border-0 shadow-sm"
                  >
                    + Post a Requirement
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map(req => (
                    <Card
                      key={req.id}
                      className="border-0 rounded-2xl p-4 shadow-level-1 hover:shadow-level-2 transition-all bg-surface-card"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-headline-md text-base font-bold text-on-background mb-0">
                              {req.title}
                            </h3>
                            {req.urgent && (
                              <Badge className="bg-error-container text-error text-[11px] font-bold px-2 py-0.5 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">timer</span>
                                Urgent Need
                              </Badge>
                            )}
                            <Badge className="bg-vibrant-indigo/15 text-vibrant-indigo text-[11px] font-semibold px-2 py-0.5">
                              {req.category}
                            </Badge>
                            <Badge className="bg-surface-container-high text-on-surface-variant text-[11px] font-normal px-2 py-0.5">
                              {req.department}
                            </Badge>
                          </div>

                          <p className="text-xs text-on-surface-variant leading-relaxed mb-0">
                            {req.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-outline pt-1">
                            <span>Target Budget: <strong className="text-on-background">{req.budget}</strong></span>
                            {req.preferredMeetup && (
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-vibrant-indigo">location_on</span>
                                Meetup: <strong className="text-on-background">{req.preferredMeetup}</strong>
                              </span>
                            )}
                            <span>Posted {req.postedAt}</span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle">
                          <div className="flex items-center gap-2">
                            <img
                              src={req.postedBy.avatar}
                              alt={req.postedBy.name}
                              className="w-8 h-8 rounded-full object-cover border border-border-subtle"
                            />
                            <div className="text-left sm:text-right">
                              <p className="text-xs font-semibold text-on-background mb-0 flex items-center gap-0.5">
                                {req.postedBy.name}
                                {req.postedBy.verified && (
                                  <span className="material-symbols-outlined text-[14px] text-fresh-mint">verified</span>
                                )}
                              </p>
                              <span className="text-[11px] text-outline">{req.postedBy.department}</span>
                            </div>
                          </div>

                          <Button
                            onClick={() => openChatWith({ name: req.postedBy.name, avatar: req.postedBy.avatar }, { title: `Requirement: ${req.title}` })}
                            className="bg-vibrant-indigo hover:bg-primary-container text-white text-xs font-semibold px-4 py-2 rounded-xl border-0 shadow-sm flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[16px]">chat</span>
                            I Have This / Contact
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};
