import React from 'react';
import { Home, Users, Briefcase, FileText, PhoneCall } from 'lucide-react';

const TABS = [
  { id: 'home', label: '홈', icon: Home },
  { id: 'lawyers', label: '변호사', icon: Users },
  { id: 'services', label: '업무', icon: Briefcase },
  { id: 'cases', label: '사례', icon: FileText },
  { id: 'contact', label: '문의', icon: PhoneCall },
];

export default function BottomNav({ activeTab, onSelectTab }) {
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`nav-item-v2 ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onSelectTab(tab.id)}
          >
            <Icon size={22} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
