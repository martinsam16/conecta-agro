import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { searchProducts } from '../services/api';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchLive = async () => {
      if (searchTerm.trim().length > 1) {
        const results = await searchProducts(searchTerm);
        setLiveResults(results.slice(0, 5));
      } else {
        setLiveResults([]);
      }
    };
    fetchLive();
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsDropdownVisible(false);
    if (searchTerm.trim()) {
      navigate(`/categorias?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSelectLiveResult = (id) => {
    setIsDropdownVisible(false);
    setSearchTerm('');
    navigate(`/producto/${id}`);
  };
  return (
    <header className="header-container">
      <div className="header-left">
        <button className="icon-btn menu-btn" onClick={onMenuClick}>
          <Menu size={28} />
        </button>
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <div className="logo-icon">
            <svg width="40" height="40" viewBox="0 0 100 100">
               {/* Simplified Connecta Agro logo representation */}
               <path d="M50 10c-22 0-40 18-40 40s18 40 40 40 40-18 40-40" fill="none" stroke="#2e7d32" strokeWidth="8"/>
               <path d="M30 60 Q50 40 70 60" fill="none" stroke="#f3821f" strokeWidth="12" strokeLinecap="round"/>
               <path d="M40 70 L60 70" stroke="#2e7d32" strokeWidth="8" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="logo-text">
            <h2>Conecta</h2>
            <h3>Agro</h3>
            <span>Conectando el campo con el mercado</span>
          </div>
        </Link>
      </div>
      
      <div className="header-search" ref={dropdownRef}>
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsDropdownVisible(true)}
          />
          <button type="submit" className="search-btn">
            <Search size={20} color="#666" />
          </button>
        </form>

        {isDropdownVisible && liveResults.length > 0 && (
          <ul className="search-dropdown">
            {liveResults.map(prod => (
              <li key={prod.id} className="search-dropdown-item" onClick={() => handleSelectLiveResult(prod.id)}>
                <img src={prod.imgUrl} alt={prod.title} />
                <div className="search-dropdown-info">
                  <span className="search-dropdown-title">{prod.title}</span>
                  <span className="search-dropdown-meta">{prod.category} • {prod.producer}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="header-right">
        <button className="icon-btn user-btn">
          <User size={28} />
        </button>
      </div>
    </header>
  );
};

export default Header;
