import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeTab from './components/HomeTab';
import companyData from './data/company.json';

// 초기 진입 번들 크기를 줄이기 위해 하위 탭 및 뷰어를 지연 로딩
const LawyersTab = lazy(() => import('./components/LawyersTab'));
const ServicesTab = lazy(() => import('./components/ServicesTab'));
const CasesTab = lazy(() => import('./components/CasesTab'));
const ContactTab = lazy(() => import('./components/ContactTab'));
const IframeViewer = lazy(() => import('./components/IframeViewer'));

function TabFallback() {
  return (
    <div className="tab-loading-state" role="status" aria-live="polite">
      <div className="spinner" />
      <span>화면을 불러오는 중...</span>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [viewPage, setViewPage] = useState(null);
  const [cases, setCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(true);
  const [casesError, setCasesError] = useState(false);
  const contentRef = useRef(null);

  // 성공사례 JSON 데이터를 불러오는 함수 (재시도 지원)
  const fetchCases = useCallback((signal) => {
    setCasesLoading(true);
    setCasesError(false);

    fetch('./cases.json', { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCases(data);
        } else {
          setCases([]);
        }
        setCasesLoading(false);
      })
      .catch((err) => {
        if (err && err.name === 'AbortError') return;
        setCasesError(true);
        setCasesLoading(false);
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCases(controller.signal);
    return () => controller.abort();
  }, [fetchCases]);

  // 브라우저 뒤로가기/앞으로가기 히스토리 동기화
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

  // 탭 전환 시 본문 스크롤을 최상단으로 초기화
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0 });
    }
  }, [activeTab]);

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

  const handleRetryCases = useCallback(() => {
    fetchCases();
  }, [fetchCases]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'lawyers':
        return <LawyersTab onOpenPage={handleOpenPage} />;
      case 'services':
        return <ServicesTab onOpenPage={handleOpenPage} />;
      case 'cases':
        return (
          <CasesTab
            cases={cases}
            loading={casesLoading}
            error={casesError}
            onRetry={handleRetryCases}
            onOpenPage={handleOpenPage}
          />
        );
      case 'contact':
        return <ContactTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="app-container traditional-pattern">
      <Header title={companyData.name} />

      <main ref={contentRef} className="content-area">
        <Suspense fallback={<TabFallback />}>
          {renderTabContent()}
        </Suspense>
      </main>

      <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />

      {viewPage && (
        <Suspense fallback={null}>
          <IframeViewer page={viewPage} onClose={handleClosePage} />
        </Suspense>
      )}
    </div>
  );
}
