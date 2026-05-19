import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { MissingPhoneModal } from './components/MissingPhoneModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';

// Views
import { DashboardView } from './views/DashboardView';
import { NewOrderView } from './views/NewOrderView';
import { MassOrderView } from './views/MassOrderView';
import { OrderHistoryView } from './views/OrderHistoryView';
import { ServicesView } from './views/ServicesView';
import { MembershipsView } from './views/MembershipsView';
import { RefillView } from './views/RefillView';
import { AddBalanceView } from './views/AddBalanceView';
import { DigitalStoreView } from './views/DigitalStoreView';
import { AffiliateView } from './views/AffiliateView';
import { TicketsView } from './views/TicketsView';
import { GiftsView } from './views/GiftsView';
import { UpdatesView } from './views/UpdatesView';
import { ApiView } from './views/ApiView';
import { AiAutomationView } from './views/AiAutomationView';
import { AdminPanelView } from './views/AdminPanelView';
import { AuthView } from './views/AuthView';

const AppRouter: React.FC = () => {
  const { currentView, currentUser, twoFactorStep } = useApp();

  if (twoFactorStep) {
    return <AuthView />;
  }

  // Protected route check
  const isPublicView = currentView === 'dashboard' || currentView === 'services' || currentView === 'updates' || currentView === 'digitalStore' || currentView === 'auth';
  if (!currentUser && !isPublicView) {
    return <AuthView />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'auth': return <AuthView />;
      case 'dashboard': return <DashboardView />;
      case 'newOrder': return <NewOrderView />;
      case 'massOrder': return <MassOrderView />;
      case 'orderHistory': return <OrderHistoryView />;
      case 'services': return <ServicesView />;
      case 'memberships': return <MembershipsView />;
      case 'refill': return <RefillView />;
      case 'addBalance': return <AddBalanceView />;
      case 'digitalStore': return <DigitalStoreView />;
      case 'affiliate': return <AffiliateView />;
      case 'tickets': return <TicketsView />;
      case 'gifts': return <GiftsView />;
      case 'updates': return <UpdatesView />;
      case 'api': return <ApiView />;
      case 'aiAutomation': return <AiAutomationView />;
      case 'adminPanel': return <AdminPanelView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 lg:pr-64 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-7xl mx-auto w-full min-w-0 overflow-x-hidden">
          {renderView()}
        </main>
      </div>
      <WhatsAppWidget />
      <MissingPhoneModal />
      <OrderSuccessModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
