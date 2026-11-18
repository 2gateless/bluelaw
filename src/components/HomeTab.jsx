import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import companyData from '../data/company.json';
import noticesData from '../data/notices.json';

export default function HomeTab({ onOpenSubPage }) {
  const { intro, quote } = companyData;
  const { disasterTeam } = noticesData;

  return (
    <div className="tab-container home-tab-container">
      {/* 상단 히어로 배너 */}
      <div className="hero-section">
        <picture>
          <source srcSet="./images/bridge_bg.webp" type="image/webp" />
          <img
            src="./images/bridge_bg.png"
            alt="법무법인 청률 대표 배경"
            className="hero-image"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-overlay">
          <h2>{companyData.name}</h2>
          <p>{intro.description}</p>
        </div>
      </div>

      {/* 본문 영역 */}
      <div className="home-body">
        <div className="image-frame">
          <picture>
            <source srcSet="./images/bamboo_bg.webp" type="image/webp" />
            <img
              src="./images/bamboo_bg.png"
              alt="청률 대나무 풍경"
              width="500"
              height="247"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

        <p className="quote">{quote}</p>

        {/* 알림 섹션 */}
        <section className="home-news-section" aria-label="알림">
          <h3 className="home-news-heading">알림</h3>
          <button
            type="button"
            className="news-card home-news-btn"
            onClick={() => onOpenSubPage(disasterTeam.id)}
          >
            <span className="news-title">{disasterTeam.noticeTitle}</span>
            <ChevronRight size={18} style={{ flexShrink: 0, color: 'var(--secondary)' }} />
          </button>
        </section>

        {/* 최하단 메뉴 위 작은 주소 박스 */}
        <div className="home-address-box">
          <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>{companyData.address}</span>
        </div>
      </div>
    </div>
  );
}
