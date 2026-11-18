import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import IframeViewer from './components/IframeViewer';
import HomeTab from './components/HomeTab';
import LawyersTab from './components/LawyersTab';
import ServicesTab from './components/ServicesTab';
import CasesTab from './components/CasesTab';
import ContactTab from './components/ContactTab';
import companyData from './data/company.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [viewPage, setViewPage] = useState(null);
  const [cases, setCases] = useState([]);

  // Load cases.json
  useEffect(() => {
    fetch('./cases.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCases(data);
        }
      })
      .catch(() => {});
  }, []);

  // Sync with browser history
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ tab: 'home', viewPage: null }, '');
    }

    const handlePopState = (event) => {
      const state = event.state || { tab: 'home', viewPage: null };
      setActiveTab(state.tab || 'home');
      setViewPage(state.viewPage || null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectTab = useCallback(
    (tabId) => {
      if (tabId === activeTab && !viewPage) return;
      setActiveTab(tabId);
      setViewPage(null);
      window.history.pushState({ tab: tabId, viewPage: null }, '');
    },
    [activeTab, viewPage]
  );

  const handleOpenPage = useCallback(
    (page) => {
      setViewPage(page);
      window.history.pushState({ tab: activeTab, viewPage: page }, '');
    },
    [activeTab]
  );

  const handleClosePage = useCallback(() => {
    if (window.history.state && window.history.state.viewPage) {
      window.history.back();
    } else {
      setViewPage(null);
    }
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'lawyers':
        return <LawyersTab onOpenPage={handleOpenPage} />;
      case 'services':
        return <ServicesTab onOpenPage={handleOpenPage} />;
      case 'cases':
        return <CasesTab cases={cases} onOpenPage={handleOpenPage} />;
      case 'contact':
        return <ContactTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="app-container traditional-pattern">
      <Header title={companyData.name} />

      <main className="content-area">
        {renderTabContent()}
      </main>

      <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />

      {viewPage && (
        <IframeViewer page={viewPage} onClose={handleClosePage} />
      )}
    </div>
  );
}
