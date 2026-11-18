import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExternalLink, ArrowLeft } from 'lucide-react';

export default function IframeViewer({ page, onClose }) {
  const [loading, setLoading] = useState(true);
  const [showFallbackTip, setShowFallbackTip] = useState(false);
  const timerRef = useRef(null);

  // URL 변경 시 로딩 상태 초기화 및 4.5초 지연 안내 타이머 설정
  useEffect(() => {
    setLoading(true);
    setShowFallbackTip(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setShowFallbackTip(true);
    }, 4500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [page.url]);

  // Escape 키로 뷰어 닫기 지원
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleLoad = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setLoading(false);
  }, []);

  const handleError = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowFallbackTip(true);
  }, []);

  const handleOpenExternal = useCallback(() => {
    window.open(page.url, '_blank', 'noopener,noreferrer');
  }, [page.url]);

  return (
    <div
      className="iframe-viewer-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={page.title}
    >
      {/* 상단 내비게이션 바 */}
      <div className="iframe-viewer-header">
        <button
          type="button"
          onClick={onClose}
          className="iframe-nav-btn back"
        >
          <ArrowLeft size={16} />
          뒤로
        </button>

        <strong className="iframe-viewer-title">{page.title}</strong>

        <button
          type="button"
          onClick={handleOpenExternal}
          className="iframe-nav-btn"
        >
          <ExternalLink size={14} />
          새창
        </button>
      </div>

      {/* 외부 페이지 프레임 영역 */}
      <div className="iframe-frame-wrap">
        {loading && (
          <div className="iframe-loading-overlay" role="status" aria-live="polite">
            <div className="spinner" />
            <span style={{ fontSize: '0.85rem', color: '#666' }}>
              페이지를 불러오는 중...
            </span>
            {showFallbackTip && (
              <button
                type="button"
                onClick={handleOpenExternal}
                className="iframe-fallback-btn"
              >
                새창에서 바로 열기
              </button>
            )}
          </div>
        )}

        <iframe
          src={page.url}
          title={page.title}
          onLoad={handleLoad}
          onError={handleError}
          className="iframe-element"
        />
      </div>
    </div>
  );
}
