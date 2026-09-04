import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Badge, Button } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, DEPARTMENTS } from '../../services/mockData';

export const BrowsePage = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setSelectedProduct,
    toggleWishlist,
    wishlist
  } = useApp();

  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('newest');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedDept !== 'All Departments' && item.department !== selectedDept) {
        return false;
      }
      if (item.price > maxPrice) {
        return false;
      }
      if (verifiedOnly && !item.seller.verified) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesDept = item.department.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesCategory || matchesDept;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [products, selectedCategory, selectedDept, maxPrice, verifiedOnly, searchQuery, sortBy]);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <Container maxwidth="7xl">
        {/* Search & Results Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-on-background">
              {searchQuery ? `Results for "${searchQuery}"` : 'Browse Campus Marketplace'}
            </h1>
            <p className="text-sm text-outline mb-0">
              Showing {filteredProducts.length} verified items near your campus
            </p>
          </div>

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
        </div>

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
                  onClick={() => {
                    setSelectedCategory('All Categories');
                    setSelectedDept('All Departments');
                    setMaxPrice(5000);
                    setSearchQuery('');
                    setVerifiedOnly(false);
                  }}
                  className="text-xs text-vibrant-indigo hover:underline font-medium"
                >
                  Reset All
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

              {/* Price Range Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-on-background uppercase tracking-wider mb-0">
                    Max Price
                  </label>
                  <span className="text-xs font-bold text-vibrant-indigo">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <Form.Range
                  min={100}
                  max={10000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>

              {/* Verified Seller Toggle */}
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

          {/* Product Grid */}
          <Col lg={9} md={8}>
            {filteredProducts.length === 0 ? (
              <div className="bg-surface-card p-12 rounded-2xl text-center border border-border-subtle shadow-sm my-4">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
                <h3 className="font-headline-md text-lg font-bold text-on-background">No Campus Items Found</h3>
                <p className="text-sm text-outline max-w-sm mx-auto mt-1 mb-4">
                  We couldn't find any listings matching your search criteria or price range.
                </p>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('All Categories');
                    setSelectedDept('All Departments');
                    setMaxPrice(5000);
                    setSearchQuery('');
                  }}
                  className="rounded-full px-4"
                >
                  Clear Filters
                </Button>
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
                        <div className="h-48 overflow-hidden relative">
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
                                <span>{prod.seller.name}</span>
                                {prod.seller.verified && (
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
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};
