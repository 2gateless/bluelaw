import React, { useState, memo } from 'react';
import { ChevronRight } from 'lucide-react';

// 변호사 목록 및 대응팀 안내에서 공통으로 사용하는 변호사 카드 컴포넌트
const LawyerCard = memo(function LawyerCard({ lawyer, onSelect, showTitleSuffix = false }) {
  const [imgError, setImgError] = useState(false);
  const webpSrc = lawyer.photo;
  const pngFallback = lawyer.photo.replace('.webp', '.png');

  return (
    <button
      type="button"
      className="lawyer-card-v2"
      onClick={() => onSelect(lawyer)}
    >
      <div className="lawyer-photo-circle">
        {imgError ? (
          <div className="lawyer-photo-fallback" aria-hidden="true">
            {lawyer.name[0]}
          </div>
        ) : (
          <picture>
            <source srcSet={webpSrc} type="image/webp" />
            <img
              src={pngFallback}
              alt={`${lawyer.name} ${lawyer.position}`}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
            />
          </picture>
        )}
      </div>
      <div className="lawyer-info" style={{ flex: 1, minWidth: 0 }}>
        <h3>
          {showTitleSuffix ? `${lawyer.name} 변호사` : lawyer.name}{' '}
          <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#666' }}>
            {lawyer.position}
          </span>
        </h3>
        <p className="lawyer-career">{lawyer.career}</p>
        <div className="detail-tag">
          자세히 보기 <ChevronRight size={12} />
        </div>
      </div>
    </button>
  );
});

export default LawyerCard;
