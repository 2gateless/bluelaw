import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { flushSync } from 'react-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeTab from './components/HomeTab';
import IframeViewer from './components/IframeViewer';
import ErrorBoundary from './components/ErrorBoundary';
import companyData from './data/company.json';

// 초기 진입 번들 크기를 줄이기 위해 하위 탭 화면을 지연 로딩
const DisasterTeamView = lazy(() => import('./components/DisasterTeamView'));
const LawyersTab = lazy(() => import('./components/LawyersTab'));
const ServicesTab = lazy(() => import('./components/ServicesTab'));
const CasesTab = lazy(() => import('./components/CasesTab'));
const ContactTab = lazy(() => import('./components/ContactTab'));

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
  const [homeSubPage, setHomeSubPage] = useState(null);
  const [viewPage, setViewPage] = useState(null);
  const [cases, setCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(false);
  const [casesError, setCasesError] = useState(false);
  const casesFetchedRef = useRef(false);
  const contentRef = useRef(null);

  // 성공사례 JSON 데이터를 불러오는 함수 (사례 탭 진입 시 지연 로드 및 재시도 지원)
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
        setCases(Array.isArray(data) ? data : []);
        casesFetchedRef.current = true;
        setCasesLoading(false);
      })
      .catch((err) => {
        if (err && err.name === 'AbortError') return;
        setCasesError(true);
        setCasesLoading(false);
      });
  }, []);

  // 사례 탭에 처음 진입할 때만 cases.json 요청 수행
  useEffect(() => {
    if (activeTab !== 'cases' || casesFetchedRef.current) return;
    const controller = new AbortController();
    fetchCases(controller.signal);
    return () => controller.abort();
  }, [activeTab, fetchCases]);

  // 브라우저 뒤로가기/앞으로가기 히스토리 동기화
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ tab: 'home', homeSubPage: null, viewPage: null }, '');
    }

    const handlePopState = (event) => {
      const state = event.state || { tab: 'home', homeSubPage: null, viewPage: null };
      setActiveTab(state.tab || 'home');
      setHomeSubPage(state.homeSubPage || null);
      setViewPage(state.viewPage || null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 탭 또는 홈 하위 화면 전환 시 본문 스크롤을 최상단으로 초기화
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0 });
    }
  }, [activeTab, homeSubPage]);

  const handleSelectTab = useCallback(
    (tabId) => {
      if (tabId === activeTab && !viewPage && !homeSubPage) return;
      setActiveTab(tabId);
      setHomeSubPage(null);
      setViewPage(null);
      window.history.pushState({ tab: tabId, homeSubPage: null, viewPage: null }, '');
    },
    [activeTab, viewPage, homeSubPage]
  );

  const handleOpenHomeSubPage = useCallback((subPageId) => {
    setHomeSubPage(subPageId);
    window.history.pushState({ tab: 'home', homeSubPage: subPageId, viewPage: null }, '');
  }, []);

  const handleCloseHomeSubPage = useCallback(() => {
    if (window.history.state && window.history.state.homeSubPage) {
      window.history.back();
    } else {
      setHomeSubPage(null);
    }
  }, []);

  const handleOpenPage = useCallback(
    (page) => {
      setViewPage(page);
      window.history.pushState({ tab: activeTab, homeSubPage, viewPage: page }, '');
    },
    [activeTab, homeSubPage]
  );

  // 중대재해 대응팀 화면에서 변호사 선택 시 현재 하위 화면 상태를 유지한 채 상세 뷰어만 표시
  const handleOpenLawyerFromSubPage = useCallback(
    (lawyer) => {
      handleOpenPage({
        title: `${lawyer.name} ${lawyer.position}`,
        url: lawyer.url,
      });
    },
    [handleOpenPage]
  );

  // 뷰어 닫기 시 iframe을 먼저 언마운트하여 내부 페이지 이동 후에도 즉시 닫히도록 보장
  const handleClosePage = useCallback(() => {
    const hadHistoryView = Boolean(window.history.state && window.history.state.viewPage);
    flushSync(() => {
      setViewPage(null);
    });
    if (hadHistoryView) {
      window.history.back();
      setTimeout(() => {
        if (window.history.state && window.history.state.viewPage) {
          window.history.replaceState(
            { tab: activeTab, homeSubPage, viewPage: null },
            ''
          );
        }
      }, 50);
    }
  }, [activeTab, homeSubPage]);

  const handleRetryCases = useCallback(() => {
    fetchCases();
  }, [fetchCases]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        if (homeSubPage === 'disaster-team') {
          return (
            <DisasterTeamView
              onClose={handleCloseHomeSubPage}
              onSelectLawyer={handleOpenLawyerFromSubPage}
            />
          );
        }
        return <HomeTab onOpenSubPage={handleOpenHomeSubPage} />;
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
        return <HomeTab onOpenSubPage={handleOpenHomeSubPage} />;
    }
  };

  return (
    <div className="app-container traditional-pattern">
      <Header title={companyData.name} />

      <main ref={contentRef} className="content-area">
        <ErrorBoundary>
          <Suspense fallback={<TabFallback />}>
            {renderTabContent()}
          </Suspense>
        </ErrorBoundary>
      </main>

      <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />

      {viewPage && (
        <ErrorBoundary>
          <IframeViewer page={viewPage} onClose={handleClosePage} />
        </ErrorBoundary>
      )}
    </div>
  );
}
