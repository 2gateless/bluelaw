import React, { useMemo } from 'react';
import { MapPin, ChevronRight, ArrowLeft } from 'lucide-react';
import companyData from '../data/company.json';
import lawyersData from '../data/lawyers.json';
import LawyerCard from './LawyerCard';

// 중대재해 대응팀 담당 변호사 이름 목록
const DISASTER_TEAM_NAMES = ['노태홍', '김종운', '최병일'];

// 중대재해 대응팀 주요 업무 목록
const DISASTER_TEAM_SERVICES = [
  {
    category: '중대재해·산업안전 Compliance 자문',
    items: [
      '중대재해처벌법 관련 안전보건관리체계 구축 및 이행 자문',
      '산업안전보건법 관련 규정, 제도, 시스템 보완 자문',
      '안전보건관리체계 점검 및 개선 자문',
    ],
  },
  {
    category: '중대재해·산업안전 사고 대응',
    items: [
      '사고 당일 현장대응팀 파견 초기 현장조사 대응',
      '노동청, 경찰, 검찰의 관련자 조사 대응',
      '압수수색 및 포렌식 참여 대응',
      '구속영장 청구 대응',
      '작업중지명령 해제 대응',
      '재해자 유족 보상 합의 지원',
      '특별감독 대응',
      '언론 및 정부기관 행정처분 대응',
      '재판 대응',
    ],
  },
];

export default function HomeTab({ subPage, onOpenSubPage, onCloseSubPage, onSelectLawyer }) {
  const { intro, quote } = companyData;

  // lawyers.json에서 중대재해 대응팀 변호사(노태홍, 김종운, 최병일) 추출 및 순서 유지
  const disasterTeamLawyers = useMemo(() => {
    const allLawyers = [...lawyersData.partners, ...lawyersData.associates];
    return DISASTER_TEAM_NAMES
      .map((name) => allLawyers.find((lawyer) => lawyer.name === name))
      .filter(Boolean);
  }, []);

  // "중대재해 대응팀 운영" 클릭 시 표시되는 담당변호사 및 주요 업무 화면
  if (subPage === 'disaster-team') {
    return (
      <div className="tab-container disaster-team-view" style={{ paddingBottom: '20px' }}>
        <div className="subpage-header">
          <button
            type="button"
            onClick={onCloseSubPage}
            className="iframe-nav-btn back"
          >
            <ArrowLeft size={16} />
            뒤로
          </button>
          <h2 className="subpage-title">중대재해 대응팀 담당변호사</h2>
        </div>

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

        {/* 주요 업무 안내 */}
        <section className="major-tasks-section" aria-label="주요 업무">
          <h3 className="major-tasks-heading">주요 업무</h3>
          <div className="major-tasks-card">
            {DISASTER_TEAM_SERVICES.map((group) => (
              <div key={group.category} className="major-tasks-group">
                <h4 className="major-tasks-category">{group.category}</h4>
                <ul className="major-tasks-list">
                  {group.items.map((text) => (
                    <li key={text} className="major-tasks-item">
                      <span className="major-tasks-bullet" aria-hidden="true">•</span>
                      <span className="major-tasks-text">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
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

        {/* 알림 섹션 (조금 위쪽에 여유 있게 배치) */}
        <section className="home-news-section" aria-label="알림">
          <h3 className="home-news-heading">알림</h3>
          <button
            type="button"
            className="news-card home-news-btn"
            onClick={() => onOpenSubPage('disaster-team')}
          >
            <span className="news-title">중대재해 대응팀 운영</span>
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
