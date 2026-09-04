import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppNavbar } from './components/layout/Navbar';
import { AppFooter } from './components/layout/Footer';
import { DiscoverPage } from './components/pages/DiscoverPage';
import { BrowsePage } from './components/pages/BrowsePage';
import { SellerHubPage } from './components/pages/SellerHubPage';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { AddListingModal } from './components/modals/AddListingModal';
import { ToastNotification } from './components/common/ToastNotification';

const MainContent = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-on-background">
      <AppNavbar />

      <main className="flex-grow">
        {activeTab === 'discover' && <DiscoverPage />}
        {activeTab === 'browse' && <BrowsePage />}
        {activeTab === 'seller' && <SellerHubPage />}
      </main>

      <AppFooter />

      {/* Global Modals & Notifications */}
      <ProductDetailModal />
      <AddListingModal />
      <ToastNotification />
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
