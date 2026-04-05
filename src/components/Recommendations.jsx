import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { getRecommendations } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Recommendations.css';

const RecommendationCard = ({ id, title, imgUrl, price, stockStatus, quantity, producer, location }) => {
  const navigate = useNavigate();
  return (
    <div className="recommendation-card" onClick={() => navigate(`/producto/${id}`)} style={{ cursor: 'pointer' }}>
      <div className="card-image">
        <img src={imgUrl} alt={title} />
      </div>
      <div className="card-details-gradient">
        <h3 className="card-title">{title}</h3>
        <p className="card-price">PRECIO: {price}</p>

        <ul className="card-info-list">
          <li>
            <div className={`status-dot ${stockStatus === 'DISPONIBLE' ? 'green' : 'green'}`}></div>
            <span>{stockStatus === 'DISPONIBLE' ? `DISPONIBLE: ${quantity}` : 'EN STOCK'}</span>
          </li>
          {stockStatus !== 'DISPONIBLE' && (
            <li>
              <FileText size={12} className="info-icon" />
              <span>CANTIDAD DISPONIBLE: {quantity}</span>
            </li>
          )}
          <li className="location-item">
            {location && (
              <>
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="info-icon text-red">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{location}</span>
              </>
            )}
          </li>
          <li className="producer-line">PRODUCTOR: {producer}</li>
        </ul>

        <div className="card-action">
          <button className="btn btn-orange card-btn">COTIZAR</button>
        </div>
      </div>
    </div>
  );
};

const Recommendations = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations();
        setProducts(data.slice(0, 12));
      } catch (error) {
        console.error("Error fetching recommendations: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = 280; // card width + gap
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = 280; // card width + gap
      scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <div className="recommendations-section" style={{ padding: '2rem', textAlign: 'center' }}>Cargando recomendaciones...</div>;
  }

  return (
    <div className="recommendations-section">
      <h2 className="section-title">Otras recomendaciones para tu negocio</h2>

      <div className="recommendations-carousel">
        <button className="carousel-btn prev" onClick={scrollLeft}>
          <ChevronLeft size={24} />
        </button>

        <div className="cards-container" ref={scrollRef}>
          {products.map(prod => (
            <RecommendationCard key={prod.id} {...prod} />
          ))}
        </div>

        <button className="carousel-btn next" onClick={scrollRight}>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Recommendations;
