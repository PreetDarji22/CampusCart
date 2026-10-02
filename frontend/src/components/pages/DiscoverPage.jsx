import React from 'react';
import { Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../services/mockData';

export const DiscoverPage = () => {
  const {
    setActiveTab,
    setSelectedCategory,
    products,
    setSelectedProduct,
    toggleWishlist,
    wishlist,
    setIsAddListingOpen,
    setIsPostRequestOpen,
    setIsAuthOpen,
    setIsCreateEventOpen,
    setSelectedEventForTicket,
    deleteEvent,
    events,
    currentUser,
    isAuthenticated,
    isAdmin,
    requireAuth
  } = useApp();

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setActiveTab('browse');
  };

  const featuredProduct = products.find(p => p.id === 'prod-1') || products[0];

  return (
    <div className="pt-20">
      {/* Hero Overview Banner */}
      <section className="relative w-full min-h-[640px] flex items-center overflow-hidden px-margin-mobile md:px-margin-desktop py-xl hero-gradient">
        {/* Background blur blobs */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-vibrant-indigo/20 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[30rem] h-[30rem] bg-secondary-fixed/30 blur-[120px] rounded-full blob-shape"></div>
        </div>

        <Container maxwidth="7xl" className="relative z-10 mx-auto">
          <Row className="align-items-center gy-5">
            <Col lg={6} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface-card rounded-full shadow-sm border border-border-subtle">
                <span className="w-2.5 h-2.5 rounded-full bg-fresh-mint animate-pulse"></span>
                <span className="font-label-md text-xs font-semibold text-on-surface-variant">Closed Peer-to-Peer College Marketplace</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-on-background leading-tight">
                Buy, Sell & Exchange <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-vibrant-indigo via-indigo-500 to-primary">On Your Campus</span>
              </h1>

              <p className="font-body-lg text-base text-outline max-w-lg leading-relaxed">
                CampusCart is a verified student exchange platform for engineering textbooks, lab gear, calculators, hostel essentials, and tech. Zero shipping fees, zero strangers off-campus.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {!isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setIsAuthOpen(true)}
                      className="px-6 py-3 bg-vibrant-indigo text-white font-bold text-sm rounded-xl shadow-level-2 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">school</span>
                      Join with College Email
                    </button>
                    <button
                      onClick={() => setActiveTab('browse')}
                      className="px-6 py-3 bg-surface-card text-on-background font-bold text-sm rounded-xl border border-border-subtle shadow-level-1 hover:bg-surface-container-low transition-all"
                    >
                      Browse Campus Listings
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsAddListingOpen(true)}
                      className="px-6 py-3 bg-vibrant-indigo text-white font-bold text-sm rounded-xl shadow-level-2 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_circle</span>
                      Sell an Item
                    </button>
                    <button
                      onClick={() => setIsPostRequestOpen(true)}
                      className="px-6 py-3 bg-surface-card text-on-background font-bold text-sm rounded-xl border border-border-subtle shadow-level-1 hover:bg-surface-container-low transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">campaign</span>
                      Post Wanted Request
                    </button>
                  </>
                )}
              </div>

              {/* Verified Trust Stats Badge */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-subtle/80 max-w-md">
                <div>
                  <h4 className="font-headline-md text-xl font-bold text-on-background">100%</h4>
                  <p className="font-body-sm text-xs text-outline mb-0">Verified Students</p>
                </div>
                <div>
                  <h4 className="font-headline-md text-xl font-bold text-vibrant-indigo">₹0</h4>
                  <p className="font-body-sm text-xs text-outline mb-0">Zero Commission</p>
                </div>
                <div>
                  <h4 className="font-headline-md text-xl font-bold text-fresh-mint">Same-Day</h4>
                  <p className="font-body-sm text-xs text-outline mb-0">Campus Pickups</p>
                </div>
              </div>
            </Col>

            <Col lg={6} className="relative h-[480px] mt-8 lg:mt-0">
              {/* Main Featured Glass Card */}
              <div
                onClick={() => setSelectedProduct(featuredProduct)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 glass-card rounded-3xl p-4 shadow-level-3 z-30 cursor-pointer group hover:-translate-y-4 transition-all duration-500 border border-white/40 dark:border-slate-700"
              >
                <div className="w-full h-56 rounded-2xl overflow-hidden mb-3 relative">
                  <img
                    src={featuredProduct.image}
                    alt={featuredProduct.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-surface-card/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
                    <span className="font-label-md font-bold text-on-background">₹{featuredProduct.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-md text-base font-bold text-on-background leading-tight">
                      {featuredProduct.title}
                    </h3>
                    <p className="text-xs text-outline mt-1 line-clamp-1">{featuredProduct.description}</p>
                  </div>
                  <button
                    onClick={(e) => toggleWishlist(featuredProduct.id, e)}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-error-red transition-colors"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${wishlist.includes(featuredProduct.id) ? 'text-error-red filled' : ''}`}>
                      favorite
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-subtle">
                  <img
                    src={featuredProduct.seller.avatar}
                    alt={featuredProduct.seller.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs text-on-surface-variant font-medium">{featuredProduct.seller.name}</span>
                  <span className="material-symbols-outlined text-[16px] text-fresh-mint ml-auto" title="Verified Student">
                    verified
                  </span>
                </div>
              </div>

              {/* Floating Item 1 */}
              <div className="absolute top-4 right-2 sm:right-8 w-48 glass-card rounded-2xl p-3 shadow-level-2 z-20 transform rotate-6 animate-float hidden sm:block border border-white/30">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600"
                  alt="Textbook"
                  className="w-full h-28 object-cover rounded-xl mb-2"
                />
                <h4 className="font-label-md text-xs text-on-background truncate">CS & Data Structures</h4>
                <p className="text-xs text-vibrant-indigo font-bold mb-0">₹450</p>
              </div>

              {/* Floating Item 2 */}
              <div className="absolute bottom-4 left-2 sm:left-6 w-56 glass-card rounded-2xl p-3 shadow-level-2 z-40 transform -rotate-3 animate-float-reverse hidden sm:block border border-white/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-fresh-mint/20 flex items-center justify-center text-fresh-mint">
                    <span className="material-symbols-outlined text-[20px]">handshake</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-xs font-semibold text-on-background mb-0">Safe Campus Meetups</h4>
                    <p className="text-[11px] text-outline mb-0">Central Library Lobby</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================================================================
          IMPRESSIVE & VISUALLY STUNNING "HOW CAMPUSCART WORKS" (Requirement 4)
         ========================================================================= */}
      <section className="relative py-16 bg-surface-card border-y border-border-subtle/80 overflow-hidden">
        {/* Glow ambient background accents */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-vibrant-indigo/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-fresh-mint/10 rounded-full blur-3xl pointer-events-none"></div>

        <Container maxwidth="7xl" className="mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vibrant-indigo/10 text-vibrant-indigo text-xs font-bold uppercase tracking-widest mb-3 border border-vibrant-indigo/20">
              <span>⚡</span> Simple, Verified & Safe
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-on-background tracking-tight">
              How CampusCart Works
            </h2>
            <p className="text-sm text-outline mt-2.5 max-w-xl mx-auto leading-relaxed">
              Experience the seamless peer-to-peer engineering exchange lifecycle designed exclusively for college campuses.
            </p>
          </div>

          <Row className="g-4 relative">
            {/* Step 1 */}
            <Col lg={3} md={6}>
              <div className="group relative h-full bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-3xl border border-border-subtle hover:border-vibrant-indigo transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vibrant-indigo to-indigo-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-vibrant-indigo flex items-center justify-center font-display font-extrabold text-xl shadow-inner group-hover:scale-110 group-hover:bg-vibrant-indigo group-hover:text-white transition-all duration-300">
                      1
                    </div>
                    <span className="material-symbols-outlined text-indigo-400 text-[24px]">verified</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-on-background mb-2 group-hover:text-vibrant-indigo transition-colors">
                    Sign Up & Verify
                  </h3>
                  <p className="text-xs text-outline leading-relaxed mb-4">
                    Register with your college email. Select your engineering department & roll number to unlock closed-campus student trust.
                  </p>
                </div>

                <div className="pt-3 border-t border-border-subtle/60 flex items-center gap-1.5 text-[11px] font-semibold text-vibrant-indigo">
                  <span>🎓 Zero Fake Profiles</span>
                </div>
              </div>
            </Col>

            {/* Step 2 */}
            <Col lg={3} md={6}>
              <div className="group relative h-full bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-3xl border border-border-subtle hover:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-display font-extrabold text-xl shadow-inner group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                      2
                    </div>
                    <span className="material-symbols-outlined text-purple-400 text-[24px]">search_insights</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-on-background mb-2 group-hover:text-purple-600 transition-colors">
                    Discover & Request
                  </h3>
                  <p className="text-xs text-outline leading-relaxed mb-4">
                    Filter by engineering branch (CSE, ME, ECE, AI). Chat in real-time with peer sellers or broadcast your wanted gear requirements.
                  </p>
                </div>

                <div className="pt-3 border-t border-border-subtle/60 flex items-center gap-1.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                  <span>💬 Direct Student Chat</span>
                </div>
              </div>
            </Col>

            {/* Step 3 */}
            <Col lg={3} md={6}>
              <div className="group relative h-full bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-3xl border border-border-subtle hover:border-fresh-mint transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fresh-mint to-teal-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-fresh-mint flex items-center justify-center font-display font-extrabold text-xl shadow-inner group-hover:scale-110 group-hover:bg-fresh-mint group-hover:text-white transition-all duration-300">
                      3
                    </div>
                    <span className="material-symbols-outlined text-fresh-mint text-[24px]">location_city</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-on-background mb-2 group-hover:text-fresh-mint transition-colors">
                    Safe Campus Meetup
                  </h3>
                  <p className="text-xs text-outline leading-relaxed mb-4">
                    Meet at verified campus hotspots (Library Steps, Main Canteen, Quad Racks). Inspect gear in person before handing over UPI/cash.
                  </p>
                </div>

                <div className="pt-3 border-t border-border-subtle/60 flex items-center gap-1.5 text-[11px] font-semibold text-fresh-mint">
                  <span>📍 Designated Meetup Spots</span>
                </div>
              </div>
            </Col>

            {/* Step 4 */}
            <Col lg={3} md={6}>
              <div className="group relative h-full bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-3xl border border-border-subtle hover:border-sunny-amber transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sunny-amber to-amber-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-sunny-amber flex items-center justify-center font-display font-extrabold text-xl shadow-inner group-hover:scale-110 group-hover:bg-sunny-amber group-hover:text-white transition-all duration-300">
                      4
                    </div>
                    <span className="material-symbols-outlined text-sunny-amber text-[24px]">stars</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-on-background mb-2 group-hover:text-sunny-amber transition-colors">
                    Mark Sold & Review
                  </h3>
                  <p className="text-xs text-outline leading-relaxed mb-4">
                    Seller marks item as SOLD with 1-click. Both peers leave star ratings and badges to build their lifetime campus seller reputation.
                  </p>
                </div>

                <div className="pt-3 border-t border-border-subtle/60 flex items-center gap-1.5 text-[11px] font-semibold text-sunny-amber">
                  <span>⭐ Verified Peer Reputation</span>
                </div>
              </div>
            </Col>
          </Row>

          {/* Interactive Feature Pills Bar */}
          <div className="mt-10 p-4 rounded-2xl bg-surface-container-low dark:bg-slate-800/80 border border-border-subtle flex flex-wrap items-center justify-around gap-4 text-xs font-semibold text-on-surface-variant">
            <span className="flex items-center gap-1.5"><span className="text-vibrant-indigo font-bold">🔒</span> Encrypted College Auth</span>
            <span className="flex items-center gap-1.5"><span className="text-fresh-mint font-bold">⚡</span> Instant UPI & Cash Handover</span>
            <span className="flex items-center gap-1.5"><span className="text-sunny-amber font-bold">📢</span> Live Wanted Requirement Alerts</span>
            <span className="flex items-center gap-1.5"><span className="text-purple-600 font-bold">🎟️</span> Verified Event Passports</span>
          </div>
        </Container>
      </section>

      {/* Category Chips Bar */}
      <section className="px-margin-mobile md:px-margin-desktop py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline-lg text-2xl font-bold text-on-background">Explore Categories</h2>
        </div>
        <div className="flex overflow-x-auto pb-2 gap-3 hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-surface-card hover:bg-vibrant-indigo hover:text-white border border-border-subtle text-on-surface-variant font-label-md text-xs transition-all shadow-sm"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Bento Grid Section */}
      <section className="px-margin-mobile md:px-margin-desktop py-8 max-w-7xl mx-auto">
        <h2 className="font-headline-lg text-2xl font-bold text-on-background mb-6">Trending Near Campus</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]">
          {/* Large Hero Bento Box */}
          <div
            onClick={() => setSelectedProduct(products.find(p => p.id === 'prod-3') || products[0])}
            className="md:col-span-2 md:row-span-2 group relative rounded-3xl overflow-hidden shadow-level-1 hover:shadow-level-2 transition-all bg-surface-card cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48b?w=800"
              alt="Graphing Calculator"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full text-white">
              <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-label-md mb-2 inline-block">
                Electronics & Calculators
              </span>
              <h3 className="font-headline-md text-2xl font-bold leading-tight">TI-84 Plus CE Graphing Calculator</h3>
              <p className="text-sm text-white/80 mt-1">Perfect working condition for Engineering Math & Physics</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-2xl font-bold">₹3,200</span>
                <span className="text-xs bg-fresh-mint text-white px-2.5 py-1 rounded-md font-medium">Verified Peer Listing</span>
              </div>
            </div>
          </div>

          {/* Standard Items */}
          {products.slice(1, 5).map(prod => (
            <div
              key={prod.id}
              onClick={() => setSelectedProduct(prod)}
              className="group relative rounded-3xl overflow-hidden shadow-level-1 hover:shadow-level-2 transition-all bg-surface-card cursor-pointer flex flex-col justify-between p-4 border border-border-subtle"
            >
              <div className="w-full h-28 rounded-2xl overflow-hidden mb-2 relative">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => toggleWishlist(prod.id, e)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-card/80 backdrop-blur-sm flex items-center justify-center text-outline hover:text-error-red"
                >
                  <span className={`material-symbols-outlined text-[16px] ${wishlist.includes(prod.id) ? 'text-error-red filled' : ''}`}>
                    favorite
                  </span>
                </button>
              </div>

              <div>
                <h4 className="font-label-md text-xs font-bold text-on-background line-clamp-1 mb-1">{prod.title}</h4>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-vibrant-indigo text-sm">₹{prod.price.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-outline px-1.5 py-0.5 rounded bg-surface-container-low">{prod.condition}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          CAMPUS EVENTS & DIGITAL TICKET HUB (Requirement 5)
         ========================================================================= */}
      <section className="px-margin-mobile md:px-margin-desktop py-12 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-vibrant-indigo/10 rounded-full text-xs font-bold text-vibrant-indigo mb-1">
              <span>🎪</span> College Noticeboard
            </div>
            <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-background mt-1">
              Upcoming Campus Events & Gear Hub
            </h2>
            <p className="text-xs sm:text-sm text-outline mb-0">
              Register for engineering fests, hackathons & sports. Buy or rent relevant gear directly from peers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => setIsCreateEventOpen(true)}
                className="px-4 py-2.5 bg-slate-900 dark:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                + Post New Event (Admin)
              </button>
            )}

            <button
              onClick={() => setActiveTab('browse')}
              className="text-xs font-semibold text-vibrant-indigo hover:underline flex items-center gap-1 px-3 py-2 bg-surface-card rounded-xl border border-border-subtle"
            >
              Explore Gear Marketplace →
            </button>
          </div>
        </div>

        <Row className="g-4">
          {events.map(ev => {
            const isFree = !ev.entryFee || ev.entryFee === 0;
            const slotsLeft = (ev.totalSlots || 100) - (ev.registeredCount || 0);
            const percentFilled = Math.min(100, Math.round(((ev.registeredCount || 0) / (ev.totalSlots || 100)) * 100));

            return (
              <Col key={ev.id || ev._id} md={4}>
                <div className="p-5 rounded-3xl bg-surface-card border border-border-subtle shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full space-y-4 relative overflow-hidden group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-vibrant-indigo/15 text-vibrant-indigo">
                        {ev.category}
                      </span>
                      <span className="text-xs font-semibold text-on-surface-variant font-mono bg-surface-container-low px-2.5 py-0.5 rounded-md">
                        {ev.date}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-lg text-on-background group-hover:text-vibrant-indigo transition-colors leading-snug">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-outline line-clamp-2 mt-1 leading-relaxed">{ev.description}</p>
                    </div>

                    <div className="space-y-1 text-xs text-outline">
                      <p className="flex items-center gap-1.5 mb-1">
                        <span className="material-symbols-outlined text-[16px] text-vibrant-indigo">location_on</span>
                        <span className="font-medium text-on-surface">{ev.venue}</span>
                      </p>
                      <p className="flex items-center gap-1.5 mb-0">
                        <span className="material-symbols-outlined text-[16px] text-fresh-mint">schedule</span>
                        <span>{ev.time || '09:00 AM - 05:00 PM'}</span>
                      </p>
                    </div>

                    {/* Slots Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-outline">Registration Status</span>
                        <span className={slotsLeft <= 20 ? 'text-amber-500 font-bold' : 'text-emerald-600 dark:text-emerald-400'}>
                          {slotsLeft > 0 ? `${slotsLeft} slots remaining` : 'Housefull'}
                        </span>
                      </div>
                      <ProgressBar
                        now={percentFilled}
                        variant={percentFilled > 80 ? 'warning' : 'info'}
                        className="h-1.5 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border-subtle/80 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-outline block">TICKET FEE</span>
                        <span className="font-bold text-sm text-on-background">
                          {isFree ? 'FREE Entry 🎓' : `₹${ev.entryFee}`}
                        </span>
                      </div>

                      <span className="text-[11px] text-fresh-mint font-semibold bg-fresh-mint/10 px-2.5 py-1 rounded-lg">
                        ⚡ {ev.gearTag || 'Marketplace Gear'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedEventForTicket(ev)}
                        className="flex-1 py-2.5 bg-vibrant-indigo hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
                        {isFree ? 'Register Free 🚀' : `Get Ticket (₹${ev.entryFee}) 🎟️`}
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => deleteEvent(ev.id || ev._id)}
                          className="px-2.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete Event (Admin)"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </section>

      {/* Student Wanted Callout Banner */}
      <section className="px-margin-mobile md:px-margin-desktop py-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-vibrant-indigo/10 via-surface-card to-fresh-mint/10 p-6 sm:p-8 rounded-3xl border border-border-subtle shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-card rounded-full shadow-sm text-xs font-semibold text-vibrant-indigo">
              <span className="material-symbols-outlined text-[16px]">campaign</span>
              Student Wanted Bulletin
            </div>
            <h3 className="font-headline-md text-xl sm:text-2xl font-bold text-on-background">
              Looking for something specific that isn't listed yet?
            </h3>
            <p className="text-xs sm:text-sm text-outline max-w-xl mb-0">
              Post a student requirement in seconds. Peers across your engineering department and hostel blocks will see it and reach out to help you!
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setActiveTab('browse');
              }}
              className="px-5 py-2.5 bg-surface-card text-on-background font-semibold text-xs rounded-xl border border-border-subtle hover:bg-surface-container-low transition-all shadow-sm"
            >
              View Student Requests
            </button>
            <button
              onClick={() => {
                setIsPostRequestOpen(true);
              }}
              className="px-5 py-2.5 bg-vibrant-indigo text-white font-bold text-xs rounded-xl shadow-level-1 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              Post a Requirement
            </button>
          </div>
        </div>
      </section>

      {/* Campus Safety & FAQ Accordion Section */}
      <section className="px-margin-mobile md:px-margin-desktop py-12 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-vibrant-indigo font-bold text-xs uppercase tracking-widest">Campus Guidelines</span>
          <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-background mt-1">Frequently Asked Questions & Safety Tips</h2>
          <p className="text-xs sm:text-sm text-outline mt-1 max-w-lg mx-auto">
            Everything you need to know about peer-to-peer exchanges and safe on-campus trading.
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-surface-card p-4 rounded-2xl border border-border-subtle shadow-sm">
            <h4 className="font-bold text-sm text-on-background flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-vibrant-indigo text-[18px]">verified_user</span>
              How does CampusCart verify students?
            </h4>
            <p className="text-xs text-outline leading-relaxed mb-0">
              Students authenticate with their official college email address and provide their academic department and student ID credentials to ensure a closed, safe campus ecosystem with zero random off-campus strangers.
            </p>
          </div>

          <div className="bg-surface-card p-4 rounded-2xl border border-border-subtle shadow-sm">
            <h4 className="font-bold text-sm text-on-background flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-fresh-mint text-[18px]">location_on</span>
              Where should we meet for item handovers?
            </h4>
            <p className="text-xs text-outline leading-relaxed mb-0">
              Always select one of the designated safe campus meetup spots (e.g. Central Library Lobby, Student Union Quad, Main Canteen, or Engineering Foyer) in daytime hours where you can inspect items in person.
            </p>
          </div>

          <div className="bg-surface-card p-4 rounded-2xl border border-border-subtle shadow-sm">
            <h4 className="font-bold text-sm text-on-background flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-sunny-amber text-[18px]">payments</span>
              How do payments work?
            </h4>
            <p className="text-xs text-outline leading-relaxed mb-0">
              CampusCart charges zero transaction fees. Buyers inspect physical textbooks, electronics, or dorm essentials in-person during the on-campus meetup and pay the seller directly using UPI or cash.
            </p>
          </div>

          <div className="bg-surface-card p-4 rounded-2xl border border-border-subtle shadow-sm">
            <h4 className="font-bold text-sm text-on-background flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-vibrant-indigo text-[18px]">campaign</span>
              What is the Student Wanted Bulletin?
            </h4>
            <p className="text-xs text-outline leading-relaxed mb-0">
              If an item you need is not currently listed for sale, you can post a requirement on the Student Wanted feed. Fellow students with that item will see your post and contact you directly via chat.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
