import React from 'react';
import { Home, Grid, Tractor, Calculator, FileSearch, MessageCircle, X } from 'lucide-react';
import './MobileMenu.css';

const menuItems = [
  { id: 'Inicio', title: 'Inicio', icon: Home },
  { id: 'Categorias', title: 'Categorías', icon: Grid },
  { id: 'Productores', title: 'Productores', icon: Tractor },
  { id: 'Cotiza', title: 'Cotiza', icon: Calculator },
  { id: 'Seguimiento', title: 'Seguimiento', icon: FileSearch },
  { id: 'Contacta', title: 'Contacta', icon: MessageCircle }
];

const MobileMenu = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  return (
    <div className="mobile-menu-overlay" onClick={onClose}>
      <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-menu-header">
        <div className="mobile-menu-logo">
          <div className="mobile-menu-logo-icon">
            <svg viewBox="0 0 100 100">
               <path d="M50 10c-22 0-40 18-40 40s18 40 40 40 40-18 40-40" fill="none" stroke="#2e7d32" strokeWidth="8"/>
               <path d="M30 60 Q50 40 70 60" fill="none" stroke="#f3821f" strokeWidth="12" strokeLinecap="round"/>
               <path d="M40 70 L60 70" stroke="#2e7d32" strokeWidth="8" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="mobile-menu-logo-text">
            <h2>Conecta</h2>
            <h3>Agro</h3>
            <span>Conectando el campo con el mercado</span>
          </div>
        </div>
        
        <div className="mobile-menu-close" onClick={onClose}>
          <X size={48} strokeWidth={2.5} />
        </div>
      </div>

      <div className="mobile-menu-content">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button 
              key={item.id} 
              className="mobile-menu-item"
              onClick={() => onNavigate(item.title)}
            >
              <div className="mobile-menu-icon">
                <IconComponent size={24} strokeWidth={1.5} />
              </div>
              <span>{item.title}</span>
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
