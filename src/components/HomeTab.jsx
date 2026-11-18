import React, { useMemo } from 'react';
import { MapPin, ChevronRight, ArrowLeft } from 'lucide-react';
import companyData from '../data/company.json';
import lawyersData from '../data/lawyers.json';
import LawyerCard from './LawyerCard';

// 중대재해 대응팀 구성 변호사 이름 목록
const DISASTER_TEAM_NAMES = ['노태홍', '김종운', '최병일'];

export default function HomeTab({ subPage, onOpenSubPage, onCloseSubPage, onSelectLawyer }) {
  const { intro, quote } = companyData;

  // lawyers.json에서 중대재해 대응팀 변호사(노태홍, 김종운, 최병일) 추출 및 순서 유지
  const disasterTeamLawyers = useMemo(() => {
    const allLawyers = [...lawyersData.partners, ...lawyersData.associates];
    return DISASTER_TEAM_NAMES
      .map((name) => allLawyers.find((lawyer) => lawyer.name === name))
      .filter(Boolean);
  }, []);

  // "중대재해 대응팀 운영" 클릭 시 표시되는 구성변호사 화면
  if (subPage === 'disaster-team') {
    return (
      <div className="tab-container" style={{ paddingBottom: '30px' }}>
        <div className="subpage-header">
          <button
            type="button"
            onClick={onCloseSubPage}
            className="iframe-nav-btn back"
          >
            <ArrowLeft size={16} />
            뒤로
          </button>
          <h2 className="subpage-title">중대재해 대응팀 구성변호사</h2>
        </div>

        <p className="subpage-summary">
          노태홍 변호사, 김종운 변호사, 최병일 변호사
        </p>

        <div>
          {disasterTeamLawyers.map((lawyer) => (
            <LawyerCard
              key={lawyer.id}
              lawyer={lawyer}
              onSelect={onSelectLawyer}
              showTitleSuffix
            />
          ))}
        </div>
      </div>
    );
  }

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
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

        <p className="quote">{quote}</p>

        {/* 하단 최근 소식 및 주소 영역 */}
        <div className="home-bottom-stack">
          <section className="home-news-section" aria-label="최근 소식">
            <h3 className="home-news-heading">최근 소식</h3>
            <button
              type="button"
              className="news-card home-news-btn"
              onClick={() => onOpenSubPage('disaster-team')}
            >
              <span className="news-title">중대재해 대응팀 운영</span>
              <ChevronRight size={16} style={{ flexShrink: 0, color: 'var(--secondary)' }} />
            </button>
          </section>

          {/* 최하단 메뉴 위 작은 주소 박스 */}
          <div className="home-address-box">
            <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span>{companyData.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
