import React from 'react';
import { MapPin } from 'lucide-react';
import companyData from '../data/company.json';

export default function HomeTab() {
  const { intro, quote } = companyData;

  return (
    <div className="tab-container">
      {/* Hero Section */}
      <div className="hero-section">
        <picture>
          <source srcSet="./images/bridge_bg.webp" type="image/webp" />
          <img
            src="./images/bridge_bg.png"
            alt="Hero Background"
            className="hero-image"
            loading="eager"
          />
        </picture>
        <div className="hero-overlay">
          <h2>{companyData.name}</h2>
          <p>{intro.description}</p>
        </div>
      </div>

      {/* Main Intro Body */}
      <div style={{ marginTop: '20px', padding: '0 20px 30px' }}>
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

        {/* Info box */}
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#555',
            lineHeight: 1.6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
            <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '3px' }} />
            <span>{companyData.address}</span>
          </div>
          <div style={{ borderTop: '1px dashed #eee', paddingTop: '8px', fontSize: '0.8rem', color: '#777' }}>
            대표전화: {companyData.phone} | 평일 09:00 ~ 18:00
          </div>
        </div>
      </div>
    </div>
  );
}
