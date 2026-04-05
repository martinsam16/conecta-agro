import React from 'react';
import { Linkedin, Facebook, MessageCircle } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="content-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="footer-logo">
          <div className="logo-icon-footer">
            <svg width="60" height="60" viewBox="0 0 100 100">
               <path d="M50 10c-22 0-40 18-40 40s18 40 40 40 40-18 40-40" fill="none" stroke="#2e7d32" strokeWidth="8"/>
               <path d="M30 60 Q50 40 70 60" fill="none" stroke="#1d4d20" strokeWidth="12" strokeLinecap="round"/>
               <path d="M40 70 L60 70" stroke="#2e7d32" strokeWidth="8" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="logo-text-footer">
            <h2>Conecta</h2>
            <h3>Agro</h3>
            <span>Conectando el campo con el mercado</span>
          </div>
        </div>

        <div className="footer-social-icons">
          <div className="social-icon"><Linkedin size={24} fill="#111" stroke="#111" /></div>
          <div className="social-icon"><Facebook size={24} fill="#111" stroke="#111" /></div>
          <div className="social-icon"><MessageCircle size={24} fill="#111" stroke="#111" /></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
