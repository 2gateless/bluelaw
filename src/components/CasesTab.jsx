import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, X } from 'lucide-react';

const CATEGORIES = [
  '전체',
  '민사',
  '형사',
  '가사',
  '일반행정, 조세',
  '기업회생 및 파산',
];

export default function CasesTab({ cases, onOpenPage }) {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const matchCategory =
        activeCategory === '전체' || item.type === activeCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
      );
    });
  }, [cases, activeCategory, searchQuery]);

  return (
    <div className="tab-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '16px' }}>
        <h2 className="section-header" style={{ margin: '20px 16px 10px', flex: 1 }}>
          성공 사례 ({filteredCases.length}건)
        </h2>
      </div>

      {/* Search Bar */}
      <div style={{ padding: '0 16px 10px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: '20px',
            padding: '6px 12px',
            gap: '8px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Search size={16} style={{ color: '#888', flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="사례 제목 또는 키워드 검색..."
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '0.85rem',
              width: '100%',
              background: 'transparent',
              fontFamily: 'inherit',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#999',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          padding: '0 16px 12px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '6px 12px',
                borderRadius: '20px',
                border: `1px solid ${isSelected ? 'var(--primary)' : '#ddd'}`,
                background: isSelected ? 'var(--primary)' : '#ffffff',
                color: isSelected ? '#ffffff' : '#444444',
                fontSize: '0.8rem',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Cases List */}
      <div
        style={{
          padding: '0 16px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {filteredCases.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#888',
              fontSize: '0.9rem',
              background: '#ffffff',
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
            }}
          >
            검색 결과가 없습니다.
          </div>
        ) : (
          filteredCases.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                onOpenPage({
                  title: `[${item.type}] ${item.title}`,
                  url: item.url,
                })
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.1s ease',
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: '#f3efe6',
                  color: 'var(--primary)',
                }}
              >
                {item.type}
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: '0.88rem',
                  color: '#222',
                  lineHeight: 1.4,
                  wordBreak: 'keep-all',
                }}
              >
                {item.title}
              </span>
              <ChevronRight
                size={14}
                style={{ flexShrink: 0, color: '#999' }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
