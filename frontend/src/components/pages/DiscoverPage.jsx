import React, { useState, useMemo } from 'react';
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
    setIsAddListingOpen,
    setIsPostRequestOpen,
    setIsAuthOpen,
    events,
    isAuthenticated
  } = useApp();

  const [activeFaqCategory, setActiveFaqCategory] = useState('All Topics');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState(1); // First item open by default
  const [faqFeedback, setFaqFeedback] = useState({}); // Track helpful votes

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setActiveTab('browse');
  };

  const toggleFaq = (id) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  const handleFeedback = (id, type, e) => {
    e.stopPropagation();
    setFaqFeedback(prev => ({ ...prev, [id]: type }));
  };

  const featuredProduct = products.find(p => p.id === 'prod-1') || products[0];
  const upcomingEventHighlight = events?.[0] || {
    title: 'Campus Hackathon 2026',
    date: 'Oct 18 - 20, 2026',
    venue: 'Main Innovation Lab',
    category: 'Hackathon'
  };

  // Comprehensive, Rich Campus FAQ Database
  const FAQ_DATA = [
    {
      id: 1,
      category: 'Verification & Trust',
      icon: 'verified_user',
      iconColor: 'text-vibrant-indigo bg-indigo-50 dark:bg-indigo-950/60',
      badge: '100% University Verified',
      question: 'How does CampusCart verify that only authentic college students use the platform?',
      answer:
        'Every student must register using their official college email address (e.g. student@college.edu) and select their engineering department (CSE, IT, AIML, ME, EE, ECE, Civil, etc.). Unverified off-campus strangers or commercial spammers are strictly blocked from listing items, posting requirements, or contacting students.',
      highlights: ['Institutional college email verification', 'Department-specific badges', 'Strict anti-stranger campus firewall'],
      tips: 'Always check for the green Verified Student shield badge next to a peer’s name on listing cards.'
    },
    {
      id: 2,
      category: 'Campus Meetups',
      icon: 'location_on',
      iconColor: 'text-fresh-mint bg-emerald-50 dark:bg-emerald-950/60',
      badge: 'Safe Daylight Zones',
      question: 'Where are the designated safe campus meetup spots for item testing and exchange?',
      answer:
        'To guarantee physical safety and ease of inspection, all handovers must take place at established campus public zones with high student footfall and security coverage during daytime hours:',
      steps: [
        'Central Library Lobby & Steps (Best for quiet book/calculator checks)',
        'Engineering Complex Foyer & Tech Labs (Best for testing Arduino & electronic kits)',
        'Student Union Quad & Main Canteen (High footfall daylight area)',
        'Hostel Gate Security Desks (For evening textbook exchanges)'
      ],
      tips: 'You can tap the 1-click Meetup Chips directly inside the in-app chat to suggest meeting spots in seconds.'
    },
    {
      id: 3,
      category: 'Payments & Pricing',
      icon: 'payments',
      iconColor: 'text-sunny-amber bg-amber-50 dark:bg-amber-950/60',
      badge: 'Zero Commission Fees',
      question: 'How do payments work and does CampusCart take any transaction cut or fee?',
      answer:
        'CampusCart charges exactly 0% commission fees! Transactions are 100% peer-to-peer. You meet on campus, physically inspect the drafter, lab coat, or graphing calculator, and once satisfied, transfer funds directly to the seller via UPI QR code (GPay, PhonePe, Paytm) or exact cash.',
      highlights: ['0% platform service fees', 'Direct student-to-student UPI/Cash', 'Inspect physically before paying a single rupee'],
      tips: 'Never send advance booking deposits online before meeting the seller in person on campus.'
    },
    {
      id: 4,
      category: 'Buying & Selling',
      icon: 'campaign',
      iconColor: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60',
      badge: 'Broadcast ISO',
      question: 'What is the Student Wanted Bulletin and how does it help me find rare items?',
      answer:
        'If an item you need (such as a specific 3rd-semester circuit theory reference book, engineering graphics roller scale, or robotics motor driver) is not currently listed for sale, you can post an In Search Of (ISO) requirement. The request is instantly broadcasted to students across all engineering branches, allowing seniors with spare gear to message you directly.',
      highlights: ['Broadcast requirements in 10 seconds', 'Tag your branch & budget preference', 'Instant notification when peers reply'],
      tips: 'Specify your urgency badge (High/Medium) and semester so matching seniors can reach out immediately.'
    },
    {
      id: 5,
      category: 'Buying & Selling',
      icon: 'menu_book',
      iconColor: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60',
      badge: 'Senior Pass-Down',
      question: 'Can 1st-year juniors buy semester kits and drafters directly from senior batches?',
      answer:
        'Yes! CampusCart is designed specifically around university engineering academic semesters. Seniors pass down mini-drafters, roller scales, Arduino & Raspberry Pi kits, breadboards, engineering mechanics guides, and workshop coats to junior batches at up to 70% off retail store prices.',
      highlights: ['Save up to 70% compared to campus bookstore prices', 'Tested equipment with genuine senior guidance', 'Sustainable eco-friendly campus reuse'],
      tips: 'Check the catalog at semester start when senior batches post bulk course essentials.'
    },
    {
      id: 6,
      category: 'Events & Notices',
      icon: 'confirmation_number',
      iconColor: 'text-pink-600 bg-pink-50 dark:bg-pink-950/60',
      badge: 'Instant QR Pass',
      question: 'How do campus event registrations, digital passes, and hackathon tickets work?',
      answer:
        'College admins and student clubs post verified technical hackathons, coding workshops, cultural fests, and sports leagues on the dedicated Campus Events Hub. Students can register with 1-click and receive an instant digital ticket passport containing a unique QR code and Ticket ID (e.g. TKT-HACK-8921) saved to their profile.',
      highlights: ['Verified club & faculty event postings', 'Real-time seat capacity counter', 'Instant downloadable digital QR pass'],
      tips: 'You can save or print your ticket passport PDF directly to show at the auditorium or lab entrance.'
    },
    {
      id: 7,
      category: 'Verification & Trust',
      icon: 'stars',
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
      badge: 'Peer Karma & Reviews',
      question: 'How does the student star rating and reputation review system work?',
      answer:
        'Whenever a transaction or exchange is completed, the seller marks the item as SOLD. The buyer is prompted to submit a verified 1 to 5-star rating with an honest review. Top-rated students earn "Trusted Campus Peer" badges, boosting confidence for future exchanges.',
      highlights: ['Authentic peer feedback only from completed trades', 'Badges for punctual meetups and quality items', 'Zero anonymous fake reviews'],
      tips: 'Maintaining prompt chat replies and clear item descriptions ensures a 5.0 campus seller score.'
    },
    {
      id: 8,
      category: 'Payments & Pricing',
      icon: 'tune',
      iconColor: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60',
      badge: 'Friendly Haggling',
      question: 'Can I negotiate or send custom price offers using the built-in student chat?',
      answer:
        'Yes! On any product page, clicking "Chat with Seller" or "Make Offer" allows you to propose a reasonable peer price. Both students can converse in real-time, negotiate bundle deals (e.g. buying a drafter + lab manual together), and agree on the final handover price before meeting.',
      highlights: ['Real-time student messaging', 'Quick price counter-offers', 'Bundle discount negotiations'],
      tips: 'Be polite and fair when proposing discounts; remember, you are dealing with fellow classmates!'
    },
    {
      id: 9,
      category: 'Buying & Selling',
      icon: 'lock',
      iconColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60',
      badge: 'User Privacy',
      question: 'Are my cart, wishlist, and active listings completely private to my account?',
      answer:
        'Yes, CampusCart implements strict account-isolated state persistence. Your shopping bag, saved wishlist favorites, chat history, and posted listings are stored under your unique login credentials and are never mixed with other users or guests.',
      highlights: ['Independent cart and wishlist per user', 'Encrypted local session cache', 'Seamless sync across browser sessions'],
      tips: 'Logging out safely preserves your personal wishlist until you sign in again.'
    },
    {
      id: 10,
      category: 'Campus Meetups',
      icon: 'schedule',
      iconColor: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60',
      badge: 'Punctuality Rules',
      question: 'What happens if a buyer or seller reschedules or fails to show up on campus?',
      answer:
        'You can send an instant message in the chat thread to reschedule or agree on an alternate break period between lectures. If a user consistently no-shows or acts in bad faith, you can decline the offer or report the profile for moderator review.',
      highlights: ['In-app meetup rescheduling', '15-minute prior reminder chats', 'Student accountability protection'],
      tips: 'Always confirm the meetup spot and time 15 minutes before the lecture ends.'
    },
    {
      id: 11,
      category: 'Payments & Pricing',
      icon: 'replay',
      iconColor: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60',
      badge: 'Quality Guarantee',
      question: 'What should I do if an electronic item or calculator has a hidden defect?',
      answer:
        'We strongly encourage buyers to thoroughly power-on and test electronic devices (calculators, breadboards, power adapters) during the physical meetup. Sellers agree to a 24-hour campus honor-return policy for mechanical/electronic equipment if not functioning as advertised.',
      highlights: ['Physical testing during handover', '24-hour campus honor return period', 'Admin dispute resolution support'],
      tips: 'Bring a couple of AAA batteries or a power bank with you to test electronics at the meetup spot.'
    },
    {
      id: 12,
      category: 'Verification & Trust',
      icon: 'shield',
      iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/60',
      badge: 'Active Moderation',
      question: 'How do I report a policy violation, prohibited item, or suspicious account?',
      answer:
        'Every listing, requirement card, and chat conversation features a 1-click "Report" button. Flagged items are instantly submitted to faculty and student council moderators with priority escalation to keep the marketplace 100% clean and compliant.',
      highlights: ['1-click instant reporting', 'Rapid moderator review', 'Strict zero-tolerance policy for banned items'],
      tips: 'Prohibited items include non-academic commercial goods, weapons, and off-campus services.'
    }
  ];

  const FAQ_CATEGORIES = [
    'All Topics',
    'Verification & Trust',
    'Buying & Selling',
    'Campus Meetups',
    'Payments & Pricing',
    'Events & Notices'
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(faq => {
      const matchesCategory = activeFaqCategory === 'All Topics' || faq.category === activeFaqCategory;
      const q = faqSearchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;
      const inQuestion = faq.question.toLowerCase().includes(q);
      const inAnswer = faq.answer.toLowerCase().includes(q);
      const inBadge = faq.badge?.toLowerCase().includes(q);
      const inHighlights = faq.highlights?.some(h => h.toLowerCase().includes(q));
      return matchesCategory && (inQuestion || inAnswer || inBadge || inHighlights);
    });
  }, [activeFaqCategory, faqSearchQuery]);

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
          {/* Top Live Event Callout Pill */}
          <div className="mb-4">
            <button
              onClick={() => setActiveTab('events')}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-card/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-sm border border-vibrant-indigo/30 hover:border-vibrant-indigo transition-all group"
            >
              <span className="w-2 h-2 rounded-full bg-fresh-mint animate-pulse"></span>
              <span className="text-xs font-bold text-vibrant-indigo uppercase tracking-wider">
                🎪 Happening On Campus:
              </span>
              <span className="text-xs text-on-background font-semibold group-hover:underline">
                {upcomingEventHighlight.title} ({upcomingEventHighlight.date})
              </span>
              <span className="text-xs text-outline group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>

          <Row className="align-items-center gy-5">
            <Col lg={6} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface-card rounded-full shadow-sm border border-border-subtle">
                <span className="w-2.5 h-2.5 rounded-full bg-fresh-mint"></span>
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
                    <button
                      onClick={() => setActiveTab('events')}
                      className="px-5 py-3 bg-surface-container-low dark:bg-slate-800 text-vibrant-indigo font-bold text-sm rounded-xl border border-border-subtle shadow-sm hover:bg-surface-card transition-all flex items-center gap-1.5"
                    >
                      <span>🎪</span> Campus Events Hub
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
                    <button
                      onClick={() => setActiveTab('events')}
                      className="px-5 py-3 bg-surface-container-low dark:bg-slate-800 text-vibrant-indigo font-bold text-sm rounded-xl border border-border-subtle shadow-sm hover:bg-surface-card transition-all flex items-center gap-1.5"
                    >
                      <span>🎪</span> Events Hub
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
          HOW CAMPUSCART WORKS (High Impact Redesign)
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

      {/* =========================================================================
          HIGH-IMPACT INTERACTIVE FAQ & CAMPUS SAFETY HUB
         ========================================================================= */}
      <section className="px-margin-mobile md:px-margin-desktop py-20 max-w-6xl mx-auto relative">
        {/* Glow ambient circles */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-vibrant-indigo/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-fresh-mint/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vibrant-indigo/10 text-vibrant-indigo text-xs font-bold uppercase tracking-widest mb-3 border border-vibrant-indigo/20">
            <span>🛡️</span> Campus Trust & Guidelines Center
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-on-background tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-outline mt-3 leading-relaxed">
            Everything you need to know about peer-to-peer engineering exchanges, instant UPI handovers, event passes, and safe on-campus trading.
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            <div className="p-3.5 rounded-2xl bg-surface-card dark:bg-slate-800/80 border border-border-subtle shadow-sm flex flex-col items-center justify-center">
              <span className="font-display font-extrabold text-xl text-vibrant-indigo">100%</span>
              <span className="text-[11px] font-semibold text-outline mt-0.5">Verified Student Auth</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-card dark:bg-slate-800/80 border border-border-subtle shadow-sm flex flex-col items-center justify-center">
              <span className="font-display font-extrabold text-xl text-fresh-mint">₹0</span>
              <span className="text-[11px] font-semibold text-outline mt-0.5">Zero Commission Fees</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-card dark:bg-slate-800/80 border border-border-subtle shadow-sm flex flex-col items-center justify-center">
              <span className="font-display font-extrabold text-xl text-sunny-amber">4 Hotspots</span>
              <span className="text-[11px] font-semibold text-outline mt-0.5">Safe Campus Meetup Zones</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-card dark:bg-slate-800/80 border border-border-subtle shadow-sm flex flex-col items-center justify-center">
              <span className="font-display font-extrabold text-xl text-purple-600 dark:text-purple-400">Instant QR</span>
              <span className="text-[11px] font-semibold text-outline mt-0.5">Digital Event Passports</span>
            </div>
          </div>

          {/* Live Search Bar for FAQ */}
          <div className="mt-8 relative max-w-xl mx-auto">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-outline text-[22px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., drafter, UPI, meetup, return, tickets)..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-surface-card dark:bg-slate-800/90 border border-border-subtle text-on-background text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-indigo/40 focus:border-vibrant-indigo shadow-sm transition-all placeholder:text-outline/70"
              />
              {faqSearchQuery && (
                <button
                  onClick={() => setFaqSearchQuery('')}
                  className="absolute right-3.5 w-6 h-6 rounded-full bg-surface-container-low flex items-center justify-center text-outline hover:text-on-background text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* FAQ Category Filter Tabs with Item Count */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {FAQ_CATEGORIES.map(cat => {
              const count = cat === 'All Topics'
                ? FAQ_DATA.length
                : FAQ_DATA.filter(f => f.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveFaqCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                    activeFaqCategory === cat
                      ? 'bg-vibrant-indigo text-white border-vibrant-indigo shadow-md shadow-vibrant-indigo/20 scale-105'
                      : 'bg-surface-card dark:bg-slate-800 text-on-surface-variant border-border-subtle hover:bg-surface-container-low hover:border-vibrant-indigo/40'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeFaqCategory === cat ? 'bg-white/25 text-white' : 'bg-surface-container-low text-outline'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter if searching */}
        {faqSearchQuery && (
          <div className="mb-4 text-xs text-outline text-center">
            Found <span className="font-bold text-on-background">{filteredFaqs.length}</span> results for "{faqSearchQuery}"
          </div>
        )}

        {/* Interactive Accordion List */}
        <div className="space-y-4 relative z-10">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-surface-card dark:bg-slate-900 rounded-3xl border border-border-subtle p-8">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">help_center</span>
              <h4 className="font-display font-bold text-lg text-on-background mb-1">No matching questions found</h4>
              <p className="text-xs text-outline max-w-sm mx-auto mb-4">
                Can't find what you're looking for? Try searching with different keywords or ask our campus student moderators directly.
              </p>
              <button
                onClick={() => setFaqSearchQuery('')}
                className="px-4 py-2 bg-vibrant-indigo text-white rounded-xl text-xs font-bold"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            filteredFaqs.map(faq => {
              const isOpen = openFaqId === faq.id;
              const userVote = faqFeedback[faq.id];

              return (
                <div
                  key={faq.id}
                  onClick={() => toggleFaq(faq.id)}
                  className={`rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isOpen
                      ? 'bg-surface-card dark:bg-slate-800/95 border-vibrant-indigo shadow-lg ring-1 ring-vibrant-indigo/30'
                      : 'bg-surface-card dark:bg-slate-900 border-border-subtle hover:border-vibrant-indigo/50 hover:shadow-md'
                  }`}
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${faq.iconColor}`}>
                          <span className="material-symbols-outlined text-[22px]">{faq.icon}</span>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-vibrant-indigo bg-vibrant-indigo/10 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border border-vibrant-indigo/20">
                              <span>🏷️</span> {faq.badge}
                            </span>
                            <span className="text-[10px] font-medium text-outline">
                              • {faq.category}
                            </span>
                          </div>
                          <h4 className="font-display font-bold text-sm sm:text-base text-on-background mb-0 leading-snug">
                            {faq.question}
                          </h4>
                        </div>
                      </div>

                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-surface-container-low dark:bg-slate-800 text-outline transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-vibrant-indigo bg-vibrant-indigo/10' : ''
                      }`}>
                        <span className="material-symbols-outlined text-[22px]">keyboard_arrow_down</span>
                      </div>
                    </div>

                    {/* Expanded Rich Answer */}
                    {isOpen && (
                      <div className="mt-5 pt-4 border-t border-border-subtle/80 space-y-3.5 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                        <p className="text-xs sm:text-sm text-outline leading-relaxed mb-0">
                          {faq.answer}
                        </p>

                        {/* Step Breakdown if available */}
                        {faq.steps && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {faq.steps.map((step, idx) => (
                              <div key={idx} className="p-2.5 rounded-xl bg-surface-container-low dark:bg-slate-900 border border-border-subtle flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                                <span className="w-5 h-5 rounded-full bg-vibrant-indigo text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                  {idx + 1}
                                </span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Feature Highlight Chips */}
                        {faq.highlights && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {faq.highlights.map((h, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-surface-container-low dark:bg-slate-900 border border-border-subtle text-on-surface-variant">
                                <span className="text-fresh-mint font-bold">✓</span> {h}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Pro Tip Box */}
                        {faq.tips && (
                          <div className="p-3 bg-fresh-mint/10 dark:bg-emerald-950/40 rounded-2xl border border-fresh-mint/20 text-xs text-fresh-mint font-medium flex items-start gap-2.5 shadow-inner">
                            <span className="material-symbols-outlined text-[18px] flex-shrink-0 mt-0.5">lightbulb</span>
                            <div className="leading-snug">
                              <span className="font-bold">Campus Pro-Tip:</span> {faq.tips}
                            </div>
                          </div>
                        )}

                        {/* Helpful Feedback Buttons */}
                        <div className="pt-2 border-t border-border-subtle/40 flex items-center justify-between text-xs text-outline">
                          <span className="text-[11px]">Was this answer helpful?</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleFeedback(faq.id, 'yes', e)}
                              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-all ${
                                userVote === 'yes'
                                  ? 'bg-fresh-mint text-white border-fresh-mint'
                                  : 'bg-surface-card hover:bg-surface-container-low border-border-subtle text-on-surface-variant'
                              }`}
                            >
                              <span>👍 Yes</span>
                            </button>
                            <button
                              onClick={(e) => handleFeedback(faq.id, 'no', e)}
                              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-all ${
                                userVote === 'no'
                                  ? 'bg-error-red text-white border-error-red'
                                  : 'bg-surface-card hover:bg-surface-container-low border-border-subtle text-on-surface-variant'
                              }`}
                            >
                              <span>👎 No</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Campus Safety Code & Help Callout */}
        <div className="mt-14 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden border border-white/10 z-10">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-vibrant-indigo/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-fresh-mint/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white border border-white/20">
                <span>⭐</span> Peer Safety Guarantee
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-0">
                Have an unlisted question or need immediate campus support?
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-xl leading-relaxed mb-0">
                Our active student moderators and department representatives ensure every trade is trustworthy, polite, and safe.
              </p>
            </div>

            <div className="flex flex-wrap gap-3.5 flex-shrink-0 justify-center">
              <button
                onClick={() => setActiveTab('browse')}
                className="px-5 py-3 bg-white text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                Explore Catalog
              </button>
              <button
                onClick={() => setIsPostRequestOpen(true)}
                className="px-5 py-3 bg-vibrant-indigo hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 border border-indigo-400/30"
              >
                <span className="material-symbols-outlined text-[18px]">post_add</span>
                Post Requirement
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
