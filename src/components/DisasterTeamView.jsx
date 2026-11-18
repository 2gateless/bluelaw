import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import lawyersData from '../data/lawyers.json';
import noticesData from '../data/notices.json';
import LawyerCard from './LawyerCard';

// 중대재해 대응팀 담당변호사 및 주요 업무 화면 (지연 로딩 대상)
export default function DisasterTeamView({ onClose, onSelectLawyer }) {
  const { disasterTeam } = noticesData;

  // lawyers.json에서 담당 변호사 목록을 지정된 순서대로 추출
  const disasterTeamLawyers = useMemo(() => {
    const allLawyers = [...lawyersData.partners, ...lawyersData.associates];
    return disasterTeam.lawyerNames
      .map((name) => allLawyers.find((lawyer) => lawyer.name === name))
      .filter(Boolean);
  }, [disasterTeam.lawyerNames]);

  return (
    <div className="tab-container disaster-team-view" style={{ paddingBottom: '20px' }}>
      <div className="subpage-header">
        <button
          type="button"
          onClick={onClose}
          className="iframe-nav-btn back"
        >
          <ArrowLeft size={16} />
          뒤로
        </button>
        <h2 className="subpage-title">{disasterTeam.pageTitle}</h2>
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
      <section className="major-tasks-section" aria-label={disasterTeam.majorTasksTitle}>
        <h3 className="major-tasks-heading">{disasterTeam.majorTasksTitle}</h3>
        <div className="major-tasks-card">
          {disasterTeam.services.map((group) => (
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
