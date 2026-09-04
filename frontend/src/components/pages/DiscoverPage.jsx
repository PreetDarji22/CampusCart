import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
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
    setIsAddListingOpen
  } = useApp();

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setActiveTab('browse');
  };

  const featuredProduct = products.find(p => p.id === 'prod-1') || products[0];

  return (
    <div className="pt-20">
      {/* Cinematic Hero Section */}
      <section className="relative w-full min-h-[700px] flex items-center overflow-hidden px-margin-mobile md:px-margin-desktop py-xl hero-gradient">
        {/* Decorative blur blobs */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-vibrant-indigo/20 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[30rem] h-[30rem] bg-secondary-fixed/30 blur-[120px] rounded-full blob-shape"></div>
        </div>

        <Container maxwidth="7xl" className="relative z-10 mx-auto">
          <Row className="align-items-center gy-5">
            <Col lg={5} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-card rounded-full shadow-sm border border-border-subtle">
                <span className="w-2.5 h-2.5 rounded-full bg-fresh-mint animate-pulse"></span>
                <span className="font-label-md text-xs text-on-surface-variant">Live: Campus Marketplace</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-on-background leading-tight">
                Trade <span className="text-transparent bg-clip-text bg-gradient-to-r from-vibrant-indigo to-primary">Smarter</span>.<br />
                Stay Local.
              </h1>

              <p className="font-body-lg text-base text-outline max-w-md leading-relaxed">
                The secure, student-only marketplace for textbooks, tech gadgets, and dorm essentials. Verified peers, zero shipping fees.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-3 bg-vibrant-indigo text-white font-label-md text-sm rounded-xl shadow-level-1 hover:shadow-level-2 hover:bg-primary-container transition-all active:scale-95"
                >
                  Start Browsing
                </button>
                <button
                  onClick={() => setIsAddListingOpen(true)}
                  className="px-6 py-3 bg-surface-card text-vibrant-indigo font-label-md text-sm border border-vibrant-indigo/20 rounded-xl hover:bg-vibrant-indigo/5 transition-all shadow-sm"
                >
                  List an Item
                </button>
              </div>
            </Col>

            <Col lg={7} className="relative h-[480px] mt-8 lg:mt-0">
              {/* Main Featured Glass Card */}
              <div
                onClick={() => setSelectedProduct(featuredProduct)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 glass-card rounded-2xl p-4 shadow-level-3 z-30 cursor-pointer group hover:-translate-y-4 transition-all duration-500"
              >
                <div className="w-full h-56 rounded-xl overflow-hidden mb-3 relative">
                  <img
                    src={featuredProduct.image}
                    alt={featuredProduct.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-surface-card/90 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm">
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
              <div className="absolute top-4 right-2 sm:right-8 w-48 glass-card rounded-xl p-3 shadow-level-2 z-20 transform rotate-6 animate-float hidden sm:block">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjg4urMZUMU-nM6gfR_o-mNvhkXPnzEHvgoPcvIYT-JpLLqLfJGp2Bqv1i5qH5Z6E0fHgr2WWMqRvFz45y3xPE-6g3ZqWW2WemLcLMMhLCYoaOzBO3CBV8d_PaRC3q1NCAyRdPlbQObNWv54sObTi4VMLXshnQ1DJiRGIc2XANzatJH_RcCQZhnQni5Q9Y6ZrhyjQMwrDTloVntAaQntfdvz_llRntFPeyJb1Z3YRCwY7gjFCOhZ_KcQ"
                  alt="Textbook"
                  className="w-full h-28 object-cover rounded-lg mb-2"
                />
                <h4 className="font-label-md text-xs text-on-background truncate">CS106B Textbook</h4>
                <p className="text-xs text-vibrant-indigo font-bold mb-0">₹450</p>
              </div>

              {/* Floating Item 2 */}
              <div className="absolute bottom-4 left-2 sm:left-6 w-56 glass-card rounded-xl p-3 shadow-level-2 z-40 transform -rotate-3 animate-float-reverse hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-fresh-mint/20 flex items-center justify-center text-fresh-mint">
                    <span className="material-symbols-outlined text-[20px]">handshake</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-xs font-semibold text-on-background mb-0">Safe Peer Meetups</h4>
                    <p className="text-[11px] text-outline mb-0">Central Library Lobby</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
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
            className="md:col-span-2 md:row-span-2 group relative rounded-2xl overflow-hidden shadow-level-1 hover:shadow-level-2 transition-all bg-surface-card cursor-pointer"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvKhPaF0lZm7ulpOk4vWNHJAS3ECKD5dl08g9tWhjGB4XqrTBQHjfW-TBbznW9LH4Pcy-0YnH7F5U7AX8peqywWQgMj3jqqTRvUOtFVcKSVb1WFoki_0p0yNK2FZnMnHiU6MFK8aMjs-eTd1-2e94w6YOdac9ZRr-eauI4pbqm2Z-o0QoMBotEWJ9e7mVi3dHiUe7V0Kzl8z04iRtc4cXpTX4qOB_y1Jz2fE6-HcHPP5dRQ-5bWMxzEQ"
              alt="Keychron K2 Keyboard"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full text-white">
              <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-label-md mb-2 inline-block">
                Electronics
              </span>
              <h3 className="font-headline-md text-2xl font-bold leading-tight">Keychron K2 Mechanical Keyboard</h3>
              <p className="text-sm text-white/80 mt-1">Silent switches, ideal for late dorm coding sessions</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-2xl font-bold">₹750</span>
                <span className="text-xs bg-fresh-mint text-white px-2 py-1 rounded font-medium">Verified Seller</span>
              </div>
            </div>
          </div>

          {/* Standard Item 1 */}
          {products.slice(3, 5).map(prod => (
            <div
              key={prod.id}
              onClick={() => setSelectedProduct(prod)}
              className="group bg-surface-card rounded-2xl overflow-hidden shadow-level-1 hover:shadow-level-2 transition-all flex flex-col relative cursor-pointer"
            >
              <div className="h-[60%] overflow-hidden relative">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => toggleWishlist(prod.id, e)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-outline hover:text-error-red transition-colors"
                >
                  <span className={`material-symbols-outlined text-[16px] ${wishlist.includes(prod.id) ? 'text-error-red filled' : ''}`}>
                    favorite
                  </span>
                </button>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-label-md text-sm text-on-background line-clamp-1 font-semibold">{prod.title}</h3>
                  <p className="text-xs text-outline mt-0.5">{prod.condition} • {prod.department}</p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-bold text-on-background">₹{prod.price.toLocaleString('en-IN')}</span>
                  <span className="material-symbols-outlined text-fresh-mint text-[16px]">verified</span>
                </div>
              </div>
            </div>
          ))}

          {/* Wide Guitar Bento Item */}
          <div
            onClick={() => setSelectedProduct(products.find(p => p.id === 'prod-6') || products[0])}
            className="md:col-span-2 group bg-surface-card rounded-2xl overflow-hidden shadow-level-1 hover:shadow-level-2 transition-all flex cursor-pointer"
          >
            <div className="w-[45%] overflow-hidden relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMeexABfq7X7SHzDuUetqJ1NNZf8FNhWiCSfAdKdjSgBTYtZiSpnnisCxiz3Um0LPsP-Tw9DBLBsfa6B8hbCeXlsDREmC_HbXZCiGmdOruilCOe3ePKGwNeUS30ffOBXMrKisSpm4kihT-8om4Lq9_x-RtFS5NFrpbDgJhfUWZSZU1XTjcy4xKEI9gyk1RWmtefmY4F8oWk8nBVfFpDyCLMUZpW9HFcBbVolP--eU1ko549lnbN0ZRvA"
                alt="Yamaha Guitar"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-center bg-gradient-to-r from-surface-container-low to-surface-card">
              <span className="text-vibrant-indigo font-bold text-xs uppercase tracking-wider mb-1">Graduation Sale</span>
              <h3 className="font-headline-md text-lg font-bold text-on-background leading-tight mb-1">Yamaha Acoustic Guitar</h3>
              <p className="text-xs text-outline line-clamp-2 mb-2">Comes with soft case, capo, and tuner. Great condition.</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-on-background">₹1,200</span>
                <span className="text-xs text-outline line-through">₹1,800</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
