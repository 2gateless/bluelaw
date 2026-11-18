import React from 'react';
import { ChevronRight } from 'lucide-react';
import lawyersData from '../data/lawyers.json';

function LawyerCard({ lawyer, onSelect }) {
  const [imgError, setImgError] = React.useState(false);
  const webpSrc = lawyer.photo;
  const pngFallback = lawyer.photo.replace('.webp', '.png');

  return (
    <div className="lawyer-card-v2" onClick={() => onSelect(lawyer)}>
      <div className="lawyer-photo-circle">
        {imgError ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#e9ecef',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '1.2rem',
            }}
          >
            {lawyer.name[0]}
          </div>
        ) : (
          <picture>
            <source srcSet={webpSrc} type="image/webp" />
            <img
              src={pngFallback}
              alt={lawyer.name}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
            />
          </picture>
        )}
      </div>
      <div className="lawyer-info" style={{ flex: 1, minWidth: 0 }}>
        <h3>
          {lawyer.name} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#666' }}>{lawyer.position}</span>
        </h3>
        <p className="lawyer-career">{lawyer.career}</p>
        <div className="detail-tag">
          자세히 보기 <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
}

export default function LawyersTab({ onOpenPage }) {
  const handleSelect = (lawyer) => {
    onOpenPage({
      title: `${lawyer.name} ${lawyer.position}`,
      url: lawyer.url,
    });
  };

  return (
    <div className="tab-container" style={{ paddingBottom: '30px' }}>
      <h2 className="section-header">구성원 변호사 소개</h2>
      <div>
        {lawyersData.partners.map((lawyer) => (
          <LawyerCard key={lawyer.id} lawyer={lawyer} onSelect={handleSelect} />
        ))}
      </div>

      <h2 className="section-header" style={{ marginTop: '20px' }}>
        소속 변호사 소개
      </h2>
      <div>
        {lawyersData.associates.map((lawyer) => (
          <LawyerCard key={lawyer.id} lawyer={lawyer} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}
