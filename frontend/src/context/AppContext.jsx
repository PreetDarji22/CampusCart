import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_REQUESTS, CAMPUS_EVENTS } from '../services/mockData';
import {
  fetchProducts,
  fetchRequirementsApi,
  createRequirementApi,
  deleteRequirementApi,
  fetchEventsApi,
  createEventApi,
  registerForEventApi,
  deleteEventApi
} from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Helper for safe JSON parse from localStorage
  const safeParse = (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  // Compute user-scoped storage key so each user has their own private Cart & Wishlist
  const getUserCartKey = (user) => (user?.email ? `campuscart_cart_${user.email.toLowerCase()}` : 'campuscart_cart_guest');
  const getUserWishlistKey = (user) => (user?.email ? `campuscart_wishlist_${user.email.toLowerCase()}` : 'campuscart_wishlist_guest');

  // Navigation tab: 'discover' | 'browse' | 'seller'
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(() => safeParse('campuscart_theme_dark', false));

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('campuscart_theme_dark', JSON.stringify(next));
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Current logged in student profile
  const [currentUser, setCurrentUser] = useState(() => safeParse('campuscart_user', null));
  const isAuthenticated = Boolean(currentUser);
  const isAdmin = currentUser?.role === 'admin';

  // Products state (loads from MongoDB API if available)
  const [products, setProducts] = useState(() => safeParse('campuscart_products', INITIAL_PRODUCTS));

  // Student Wanted / Requirements Feed (loads from MongoDB API if available)
  const [requests, setRequests] = useState(() => safeParse('campuscart_requests', INITIAL_REQUESTS));

  // Campus Events (loads from MongoDB API if available)
  const [events, setEvents] = useState(() => safeParse('campuscart_events', CAMPUS_EVENTS));

  // User-scoped Wishlist product IDs
  const [wishlist, setWishlist] = useState(() => safeParse(getUserWishlistKey(currentUser), []));

  // User-scoped Cart items
  const [cart, setCart] = useState(() => safeParse(getUserCartKey(currentUser), []));

  // User's own listings IDs
  const [myListingIds, setMyListingIds] = useState(() => safeParse('campuscart_my_listings', ['prod-3', 'prod-5']));

  // Orders state (Purchase Requests)
  const [orders, setOrders] = useState(() => safeParse('campuscart_orders', [
    {
      id: 'ord-101',
      productId: 'prod-1',
      productTitle: 'TI-84 Plus CE Graphing Calculator',
      productImage: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48b?w=600',
      price: 3200,
      buyerName: 'Maya Lin',
      buyerEmail: 'maya.lin@stanford.edu',
      buyerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      sellerEmail: 'alex.chen@stanford.edu',
      status: 'pending',
      notes: 'Can meet at Library Lobby today at 3pm!',
      createdAt: '10 mins ago'
    }
  ]));

  // Modal & Chat states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [isPostRequestOpen, setIsPostRequestOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedEventForTicket, setSelectedEventForTicket] = useState(null);
  const [ticketPassModalData, setTicketPassModalData] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatPartner, setActiveChatPartner] = useState(null);
  const [activeProductContext, setActiveProductContext] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', title: '' });

  // Whenever currentUser changes (login, logout, switch account), switch to that user's private Cart & Wishlist
  useEffect(() => {
    const userCart = safeParse(getUserCartKey(currentUser), []);
    const userWishlist = safeParse(getUserWishlistKey(currentUser), []);
    setCart(userCart);
    setWishlist(userWishlist);
  }, [currentUser?.email]);

  // Sync user-scoped cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(getUserCartKey(currentUser), JSON.stringify(cart));
  }, [cart, currentUser?.email]);

  // Sync user-scoped wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(getUserWishlistKey(currentUser), JSON.stringify(wishlist));
  }, [wishlist, currentUser?.email]);

  // Fetch live products, requirements, and events from MongoDB API on load
  useEffect(() => {
    fetchProducts()
      .then(res => {
        if (res.data && res.data.length > 0) {
          const apiProducts = res.data.map(p => ({
            id: p._id,
            title: p.title,
            description: p.description,
            price: p.price,
            originalPrice: p.originalPrice || Math.round(p.price * 1.5),
            category: p.category?.name || 'Misc',
            condition: p.condition || 'Good',
            image: p.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
            postedAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recently',
            sold: p.status === 'sold',
            seller: {
              name: p.sellerId?.name || 'Campus Peer',
              avatar: p.sellerId?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              verified: p.sellerId?.isVerified ?? true,
              department: p.sellerId?.department || 'Computer Science',
              year: p.sellerId?.year || 'Senior',
              rating: p.sellerId?.avgRating || 5.0,
              meetupLocation: p.meetupLocation || 'Tressider Student Union'
            }
          }));
          setProducts(apiProducts);
        }
      })
      .catch(() => {});

    fetchRequirementsApi()
      .then(res => {
        if (res.data && res.data.length > 0) {
          const apiReqs = res.data.map(r => ({
            id: r._id,
            title: r.title,
            description: r.description,
            budget: r.budget || 'Negotiable',
            category: r.category || 'Misc',
            department: r.department || 'General',
            urgent: r.urgent ?? false,
            preferredMeetup: r.preferredMeetup || 'Central Library Lobby',
            postedBy: r.postedBy || {
              name: 'Campus Student',
              department: 'General',
              year: 'Student',
              verified: true
            },
            postedAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recently'
          }));
          setRequests(apiReqs);
        }
      })
      .catch(() => {});

    fetchEventsApi()
      .then(res => {
        if (res.data && res.data.length > 0) {
          const apiEvents = res.data.map(ev => ({
            id: ev._id,
            title: ev.title,
            description: ev.description,
            category: ev.category,
            date: ev.date,
            time: ev.time || '09:00 AM - 05:00 PM',
            venue: ev.venue,
            entryFee: ev.entryFee || 0,
            totalSlots: ev.totalSlots || 100,
            registeredCount: ev.registeredCount || 0,
            gearTag: ev.gearTag || 'Marketplace Gear Recommended',
            organizer: ev.organizer || 'Campus Council'
          }));
          setEvents(apiEvents);
        }
      })
      .catch(() => {});
  }, []);

  const loginUser = (userObj) => {
    const user = {
      id: userObj._id || userObj.id || `usr-${Date.now()}`,
      name: userObj.name || 'Campus User',
      role: userObj.role || 'student',
      rollNumber: userObj.rollNumber || (userObj.role === 'admin' ? 'FACULTY-ADM' : 'STAN-2024-8841'),
      avatar: userObj.avatarUrl || userObj.avatar || (userObj.role === 'admin' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
      verified: userObj.isVerified ?? true,
      department: userObj.department || 'Computer Science & Engineering (CSE / CS)',
      year: userObj.year || (userObj.role === 'admin' ? 'Faculty / Admin' : 'Senior (Year 4)'),
      email: userObj.email || 'student@college.edu',
      phone: userObj.phone || ''
    };
    setCurrentUser(user);
    localStorage.setItem('campuscart_user', JSON.stringify(user));
    setActiveTab(user.role === 'admin' ? 'discover' : 'seller');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('campuscart_user');
    localStorage.removeItem('campuscart_token');
    setActiveTab('discover');
  };

  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      setIsAuthOpen(true);
      return false;
    }
    if (callback) callback();
    return true;
  };

  // Sync state changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('campuscart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('campuscart_my_listings', JSON.stringify(myListingIds));
  }, [myListingIds]);

  useEffect(() => {
    localStorage.setItem('campuscart_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('campuscart_events', JSON.stringify(events));
  }, [events]);

  // Toast Action
  const triggerToast = (message, title = 'CampusCart Notice') => {
    setToast({ show: true, message, title });
    setTimeout(() => {
      setToast({ show: false, message: '', title: '' });
    }, 3500);
  };

  // User-scoped Wishlist Toggle
  const toggleWishlist = (productId, e) => {
    if (e) e.stopPropagation();
    if (wishlist.includes(productId)) {
      setWishlist(prev => prev.filter(id => id !== productId));
      triggerToast('Removed item from your personal wishlist', 'Wishlist Updated');
    } else {
      setWishlist(prev => [...prev, productId]);
      triggerToast('Saved item to your personal wishlist!', 'Wishlist Updated');
    }
  };

  // User-scoped Add to Cart
  const addToCart = (product, e) => {
    if (e) e.stopPropagation();
    if (!cart.some(item => item.id === product.id)) {
      setCart(prev => [...prev, product]);
      triggerToast(`Added "${product.title}" to your personal cart.`, 'Cart Updated');
    } else {
      triggerToast(`"${product.title}" is already in your cart!`, 'Cart Notice');
    }
  };

  // User-scoped Remove from Cart
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    triggerToast('Item removed from your cart', 'Cart Updated');
  };

  const addNewListing = (newProduct) => {
    const createdProduct = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      postedAt: 'Just now',
      views: 1,
      seller: {
        name: currentUser?.name || 'Student',
        email: currentUser?.email || '',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        verified: currentUser?.verified ?? true,
        department: currentUser?.department || 'Computer Science & Engineering (CSE / CS)',
        year: currentUser?.year || 'Senior (Year 4)',
        rating: 5.0,
        meetupLocation: newProduct.meetupLocation || 'Central Library Lobby & Steps'
      }
    };

    setProducts(prev => [createdProduct, ...prev]);
    setMyListingIds(prev => [createdProduct.id, ...prev]);
    triggerToast(`Listing for "${createdProduct.title}" is now LIVE on CampusCart!`, 'Listing Published');
  };

  const addNewRequest = async (reqPayload) => {
    const newReqData = {
      title: reqPayload.title,
      description: reqPayload.description,
      budget: reqPayload.budget || 'Negotiable',
      category: reqPayload.category || 'Misc',
      department: reqPayload.department || currentUser?.department || 'Computer Science & Engineering (CSE / CS)',
      urgent: reqPayload.urgent ?? false,
      preferredMeetup: reqPayload.preferredMeetup || 'Central Library Lobby & Steps',
      postedBy: {
        name: currentUser?.name || 'Campus Student',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        department: reqPayload.department || currentUser?.department || 'Engineering',
        year: currentUser?.year || 'Student',
        verified: currentUser?.verified ?? true
      }
    };

    try {
      const res = await createRequirementApi(newReqData);
      if (res.data) {
        const createdReq = {
          id: res.data._id,
          ...res.data,
          postedAt: 'Just now'
        };
        setRequests(prev => [createdReq, ...prev]);
        triggerToast(`Your student request for "${createdReq.title}" is active in MongoDB!`, 'Request Posted');
        return;
      }
    } catch {
      // Fallback local addition
    }

    const fallbackReq = {
      ...newReqData,
      id: `req-${Date.now()}`,
      postedAt: 'Just now'
    };
    setRequests(prev => [fallbackReq, ...prev]);
    triggerToast(`Your student request for "${fallbackReq.title}" is now active!`, 'Request Posted');
  };

  const deleteRequest = async (reqId) => {
    try {
      await deleteRequirementApi(reqId);
    } catch {}
    setRequests(prev => prev.filter(r => r.id !== reqId));
    triggerToast('Student request removed from campus bulletin.', 'Requests Updated');
  };

  // Event Management (Admin Post & Student Ticket Registration)
  const addNewEvent = async (eventPayload) => {
    try {
      const res = await createEventApi(eventPayload);
      if (res.data) {
        const createdEvent = {
          id: res.data._id,
          ...res.data
        };
        setEvents(prev => [createdEvent, ...prev]);
        triggerToast(`Event "${createdEvent.title}" published to campus feed!`, 'Event Live 🎉');
        return;
      }
    } catch (err) {
      console.log('[API Event Error]', err);
    }

    const fallbackEvent = {
      ...eventPayload,
      id: `ev-${Date.now()}`,
      registeredCount: 0,
      totalSlots: Number(eventPayload.totalSlots) || 100
    };
    setEvents(prev => [fallbackEvent, ...prev]);
    triggerToast(`Event "${fallbackEvent.title}" published!`, 'Event Live 🎉');
  };

  const registerForEvent = async (eventId, bookingData) => {
    try {
      const res = await registerForEventApi(eventId, bookingData);
      if (res.data) {
        // Increment registered count in events state
        setEvents(prev =>
          prev.map(ev =>
            ev.id === eventId
              ? { ...ev, registeredCount: (ev.registeredCount || 0) + (bookingData.ticketsCount || 1) }
              : ev
          )
        );
        return res.data;
      }
    } catch (err) {
      throw err;
    }

    // Fallback simulation
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const mockTicket = {
      eventTitle: bookingData.eventTitle || 'Campus Event',
      ticketId: `TKT-PASS-${randomSuffix}`,
      attendeeName: bookingData.name,
      attendeeEmail: bookingData.email,
      department: bookingData.department,
      ticketsCount: bookingData.ticketsCount || 1,
      amountPaid: bookingData.amountPaid || 0,
      venue: bookingData.venue,
      date: bookingData.date,
      time: bookingData.time
    };

    setEvents(prev =>
      prev.map(ev =>
        ev.id === eventId
          ? { ...ev, registeredCount: (ev.registeredCount || 0) + (bookingData.ticketsCount || 1) }
          : ev
      )
    );

    return mockTicket;
  };

  const deleteEvent = async (eventId) => {
    try {
      await deleteEventApi(eventId);
    } catch {}
    setEvents(prev => prev.filter(ev => ev.id !== eventId));
    triggerToast('Campus event removed.', 'Events Hub');
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

  const createPurchaseRequest = (product, notes = '') => {
    if (!requireAuth()) return;
    if (product.seller?.email && currentUser?.email && product.seller.email.toLowerCase() === currentUser.email.toLowerCase()) {
      triggerToast('You own this listing!', 'Purchase Request');
      return;
    }

    const newOrder = {
      id: `ord-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      price: product.price,
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      buyerAvatar: currentUser.avatar,
      sellerEmail: product.seller?.email || 'alex.chen@stanford.edu',
      status: 'pending',
      notes: notes || 'Would like to purchase this item!',
      createdAt: 'Just now'
    };

    setOrders(prev => [newOrder, ...prev]);
    localStorage.setItem('campuscart_orders', JSON.stringify([newOrder, ...orders]));
    triggerToast(`Purchase request sent to ${product.seller?.name || 'seller'}!`, 'Request Sent');
  };

  const acceptPurchaseRequest = (orderId) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status: 'accepted' } : ord));
    const targetOrder = orders.find(ord => ord.id === orderId);
    if (targetOrder) {
      triggerToast(`Accepted buy request for "${targetOrder.productTitle}"! Opening chat...`, 'Request Accepted');
      openChatWith({ name: targetOrder.buyerName, avatar: targetOrder.buyerAvatar }, { title: targetOrder.productTitle });
    }
  };

  const rejectPurchaseRequest = (orderId) => {
    setOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status: 'rejected' } : ord));
    triggerToast('Purchase request declined.', 'Seller Hub');
  };

  const openChatWith = (partner, productCtx) => {
    setActiveChatPartner(partner);
    setActiveProductContext(productCtx);
    setIsChatOpen(true);
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
        requests,
        addNewRequest,
        deleteRequest,
        events,
        addNewEvent,
        registerForEvent,
        deleteEvent,
        wishlist,
        cart,
        myListingIds,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        isAdmin,
        loginUser,
        logoutUser,
        requireAuth,
        selectedProduct,
        setSelectedProduct,
        isAddListingOpen,
        setIsAddListingOpen,
        isPostRequestOpen,
        setIsPostRequestOpen,
        isCreateEventOpen,
        setIsCreateEventOpen,
        selectedEventForTicket,
        setSelectedEventForTicket,
        ticketPassModalData,
        setTicketPassModalData,
        isAuthOpen,
        setIsAuthOpen,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        orders,
        createPurchaseRequest,
        acceptPurchaseRequest,
        rejectPurchaseRequest,
        openChatWith,
        isChatOpen,
        setIsChatOpen,
        activeChatPartner,
        activeProductContext,
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
