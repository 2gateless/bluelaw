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

const ICON_MAP = {
  FileText: <FileText size={24} />,
  Gavel: <Gavel size={24} />,
  Heart: <Heart size={24} />,
  Scale: <Scale size={24} />,
  Building: <Building2 size={24} />,
  Coins: <Coins size={24} />,
  MessageSquare: <MessageSquare size={24} />,
};

export default function ServicesTab({ onOpenPage }) {
  return (
    <div className="tab-container">
      <h2 className="section-header">주요 업무분야</h2>
      <div className="service-grid">
        {servicesData.map((service) => (
          <div
            key={service.id}
            className="service-item-v2"
            onClick={() => onOpenPage({ title: `${service.title} 업무분야`, url: service.url })}
          >
            <div className="service-icon-v2">
              {ICON_MAP[service.icon] || <FileText size={24} />}
            </div>
            <h4>{service.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
