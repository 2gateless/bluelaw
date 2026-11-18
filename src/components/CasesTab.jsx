import React, { useState, useMemo, useDeferredValue, useEffect, useCallback, memo } from 'react';
import { Search, ChevronRight, X, RotateCw } from 'lucide-react';

// 기본 카테고리 표시 순서
const DEFAULT_CATEGORIES = [
  '전체',
  '민사',
  '형사',
  '가사',
  '일반행정, 조세',
  '기업회생 및 파산',
];

const PAGE_SIZE = 30;

// 개별 사례 카드 메모이제이션
const CaseItem = memo(function CaseItem({ item, onSelect }) {
  return (
    <button
      type="button"
      className="case-card"
      onClick={() => onSelect(item)}
    >
      <span className="case-type-badge">{item.type}</span>
      <span className="case-title-text">{item.title}</span>
      <ChevronRight size={14} style={{ flexShrink: 0, color: '#999' }} />
    </button>
  );
});

export default function CasesTab({ cases, loading, error, onRetry, onOpenPage }) {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // 검색 입력 시 UI 응답성을 유지하기 위해 지연된 검색어 사용
  const deferredQuery = useDeferredValue(searchQuery);

  // 데이터에 신규 카테고리가 추가되어도 자동으로 필터 칩에 반영
  const categories = useMemo(() => {
    const extraTypes = new Set();
    for (const item of cases) {
      if (item.type && !DEFAULT_CATEGORIES.includes(item.type)) {
        extraTypes.add(item.type);
      }
    }
    return [...DEFAULT_CATEGORIES, ...extraTypes];
  }, [cases]);

  // 검색어 및 카테고리 기반 필터링 (정규화는 루프 외부에서 1회 수행)
  const filteredCases = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return cases.filter((item) => {
      if (activeCategory !== '전체' && item.type !== activeCategory) {
        return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
      );
    });
  }, [cases, activeCategory, deferredQuery]);

  // 카테고리나 검색어가 변경되면 표시 개수를 초기화
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, deferredQuery]);

  const visibleCases = useMemo(
    () => filteredCases.slice(0, visibleCount),
    [filteredCases, visibleCount]
  );

  const hasMore = visibleCount < filteredCases.length;

  const handleSelectCase = useCallback(
    (item) => {
      onOpenPage({
        title: `[${item.type}] ${item.title}`,
        url: item.url,
      });
    },
    [onOpenPage]
  );

  return (
    <div className="tab-container">
      <div className="cases-header-row">
        <h2 className="section-header" style={{ margin: '20px 16px 10px', flex: 1 }}>
          성공 사례 ({filteredCases.length}건)
        </h2>
      </div>

      {/* 검색창 */}
      <div className="cases-search-wrap">
        <div className="cases-search-box">
          <Search size={16} style={{ color: '#888', flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="사례 제목 또는 키워드 검색..."
            aria-label="성공 사례 검색"
            className="cases-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="검색어 지우기"
              className="cases-search-clear"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 카테고리 필터 칩 */}
      <div className="cases-chips" role="tablist" aria-label="사례 분야 필터">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveCategory(cat)}
              className={`cases-chip ${isSelected ? 'selected' : ''}`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 사례 목록 */}
      <div className="cases-list">
        {loading ? (
          <div className="tab-loading-state" role="status" aria-live="polite">
            <div className="spinner" />
            <span>성공 사례를 불러오는 중...</span>
          </div>
        ) : error ? (
          <div className="cases-empty-box">
            <p style={{ marginBottom: '12px' }}>사례 데이터를 불러오지 못했습니다.</p>
            <button
              type="button"
              onClick={onRetry}
              className="iframe-fallback-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RotateCw size={14} />
              다시 시도
            </button>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="cases-empty-box">
            검색 결과가 없습니다.
          </div>
        ) : (
          <>
            {visibleCases.map((item) => (
              <CaseItem key={item.id} item={item} onSelect={handleSelectCase} />
            ))}
            {hasMore && (
              <button
                type="button"
                className="cases-load-more-btn"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              >
                더 보기 ({visibleCases.length} / {filteredCases.length}건)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
