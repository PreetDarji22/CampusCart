import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppNavbar } from './components/layout/Navbar';
import { AppFooter } from './components/layout/Footer';
import { DiscoverPage } from './components/pages/DiscoverPage';
import { BrowsePage } from './components/pages/BrowsePage';
import { SellerHubPage } from './components/pages/SellerHubPage';
import { EventsPage } from './components/pages/EventsPage';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { AddListingModal } from './components/modals/AddListingModal';
import { PostRequestModal } from './components/modals/PostRequestModal';
import { CreateEventModal } from './components/modals/CreateEventModal';
import { EventTicketModal } from './components/modals/EventTicketModal';
import { AuthModal } from './components/modals/AuthModal';
import { CartModal } from './components/modals/CartModal';
import { WishlistModal } from './components/modals/WishlistModal';
import { ChatModal } from './components/modals/ChatModal';
import { ToastNotification } from './components/common/ToastNotification';
import { ScrollToTop } from './components/common/ScrollToTop';

const MainContent = () => {
  const {
    activeTab,
    isAuthOpen,
    setIsAuthOpen,
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    isChatOpen,
    setIsChatOpen,
    activeChatPartner,
    activeProductContext
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-on-background">
      <AppNavbar />

      <main className="flex-grow">
        {activeTab === 'discover' && <DiscoverPage />}
        {activeTab === 'browse' && <BrowsePage />}
        {activeTab === 'events' && <EventsPage />}
        {activeTab === 'seller' && <SellerHubPage />}
      </main>

      <AppFooter />

      {/* Global Modals, Floating Actions & Notifications */}
      <ProductDetailModal />
      <AddListingModal />
      <PostRequestModal />
      <CreateEventModal />
      <EventTicketModal />
      <AuthModal show={isAuthOpen} onHide={() => setIsAuthOpen(false)} />
      <CartModal show={isCartOpen} onHide={() => setIsCartOpen(false)} />
      <WishlistModal show={isWishlistOpen} onHide={() => setIsWishlistOpen(false)} />
      <ChatModal
        show={isChatOpen}
        onHide={() => setIsChatOpen(false)}
        chatPartner={activeChatPartner}
        productContext={activeProductContext}
      />
      <ToastNotification />
      <ScrollToTop />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
