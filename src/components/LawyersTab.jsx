import React, { useCallback } from 'react';
import lawyersData from '../data/lawyers.json';
import LawyerCard from './LawyerCard';

export default function LawyersTab({ onOpenPage }) {
  const handleSelect = useCallback(
    (lawyer) => {
      onOpenPage({
        title: `${lawyer.name} ${lawyer.position}`,
        url: lawyer.url,
      });
    },
    [onOpenPage]
  );

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
