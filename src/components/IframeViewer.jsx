import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowLeft } from 'lucide-react';

export default function IframeViewer({ page, onClose }) {
  const [loading, setLoading] = useState(true);
  const [showFallbackTip, setShowFallbackTip] = useState(false);

  useEffect(() => {
    setLoading(true);
    setShowFallbackTip(false);
    const timer = setTimeout(() => {
      setShowFallbackTip(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, [page.url]);

  const handleOpenExternal = () => {
    window.open(page.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 500,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Navigation Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '2px solid var(--secondary)',
          background: '#ffffff',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <ArrowLeft size={16} />
          뒤로
        </button>

        <strong
          style={{
            fontSize: '0.95rem',
            color: 'var(--primary)',
            fontFamily: 'Noto Serif KR, serif',
            maxWidth: '55%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {page.title}
        </strong>

        <button
          type="button"
          onClick={handleOpenExternal}
          style={{
            background: 'none',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '0.8rem',
            color: '#555',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <ExternalLink size={14} />
          새창
        </button>
      </div>

      {/* Frame Container */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: '#f8f6f2',
              zIndex: 10,
            }}
          >
            <div className="spinner" />
            <span style={{ fontSize: '0.85rem', color: '#666' }}>페이지를 불러오는 중...</span>
            {showFallbackTip && (
              <button
                type="button"
                onClick={handleOpenExternal}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                새창에서 바로 열기
              </button>
            )}
          </div>
        )}

        <iframe
          src={page.url}
          title={page.title}
          onLoad={() => setLoading(false)}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            background: '#ffffff',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}
