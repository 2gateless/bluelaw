import React from 'react';
import { Phone, MapPin, Navigation, Clock } from 'lucide-react';
import companyData from '../data/company.json';

export default function ContactTab() {
  return (
    <div className="tab-container">
      <h2 className="section-header">문의 및 오시는 길</h2>
      <div style={{ padding: '0 20px 40px' }}>
        <div className="contact-card">
          {/* Phone */}
          <div className="contact-item">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#eef3f8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                flexShrink: 0,
              }}
            >
              <Phone size={20} />
            </div>
            <div>
              <p className="contact-label">법률 상담 직통 전화</p>
              <p className="contact-value" style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>
                {companyData.phone}
              </p>
            </div>
          </div>

          <div className="divider" />

          {/* Address */}
          <div className="contact-item">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#f8f4ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--secondary)',
                flexShrink: 0,
              }}
            >
              <MapPin size={20} />
            </div>
            <div>
              <p className="contact-label">사무소 주소</p>
              <p className="contact-value">{companyData.address}</p>
            </div>
          </div>

          <div className="divider" />

          {/* Hours */}
          <div className="contact-item">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                flexShrink: 0,
              }}
            >
              <Clock size={20} />
            </div>
            <div>
              <p className="contact-label">상담 및 업무 시간</p>
              <p className="contact-value" style={{ fontSize: '0.88rem', fontWeight: 500 }}>
                평일 09:00 ~ 18:00 (점심시간 12:00 ~ 13:00)
              </p>
            </div>
          </div>

          {/* Map Button */}
          <div style={{ marginTop: '16px' }}>
            <a
              href={companyData.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn-primary"
            >
              <Navigation size={16} />
              네이버 지도로 위치 및 길찾기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
