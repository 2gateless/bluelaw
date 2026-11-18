import React from 'react';
import {
  FileText,
  Gavel,
  Heart,
  Scale,
  Building2,
  Coins,
  MessageSquare,
} from 'lucide-react';
import servicesData from '../data/services.json';

// 아이콘 이름과 컴포넌트 매핑
const ICON_MAP = {
  FileText,
  Gavel,
  Heart,
  Scale,
  Building: Building2,
  Coins,
  MessageSquare,
};

export default function ServicesTab({ onOpenPage }) {
  return (
    <div className="tab-container">
      <h2 className="section-header">주요 업무분야</h2>
      <div className="service-grid">
        {servicesData.map((service) => {
          const IconComponent = ICON_MAP[service.icon] || FileText;
          return (
            <button
              key={service.id}
              type="button"
              className="service-item-v2"
              onClick={() =>
                onOpenPage({
                  title: `${service.title} 업무분야`,
                  url: service.url,
                })
              }
            >
              <div className="service-icon-v2">
                <IconComponent size={24} />
              </div>
              <h4>{service.title}</h4>
            </button>
          );
        })}
      </div>
    </div>
  );
}
