import React, { useState, useEffect } from 'react';
import { getProducers } from '../services/api';
import { MapPin, CheckCircle, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import './ProducersPage.css';

const ProducerCard = ({ producer }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const nextImg = () => {
    setCurrentImgIndex((prev) => (prev + 1) % producer.images.length);
  };

  const prevImg = () => {
    setCurrentImgIndex((prev) => (prev - 1 + producer.images.length) % producer.images.length);
  };

  return (
    <div className="producer-card">
      <div className="producer-card-info">
        <h2 className="producer-title">{producer.name}</h2>
        <div className="producer-detail">
          Tipo : {producer.type}
        </div>
        <div className="producer-detail">
          <MapPin size={18} color="#e53935" className="producer-icon" fill="#e53935" />
          {producer.location}
        </div>
        <div className="producer-detail">
          Productos principales: {producer.mainProducts}
        </div>
        <div className="producer-detail" style={{ color: '#333' }}>
          <CheckCircle size={18} color="#43a047" fill="#43a047" stroke="white" className="producer-icon" />
          {producer.isVerified ? 'Verificado / Activo.' : 'No verificado.'}
        </div>
        <div className="producer-detail">
          Tiempo de respuesta {producer.responseTime}
        </div>
        <div className="producer-detail">
          <Star size={18} color="#fdd835" fill="#fdd835" className="producer-icon" />
          Calificación / Opiniones: {producer.rating} / 5 ({producer.opinionsCount} opiniones)
        </div>
      </div>

      <div className="producer-card-right">
        <div className="producer-actions">
          <button className="producer-action-btn">CHATEA AHORA</button>
          <button className="producer-action-btn">CONTACTA</button>
          <button className="producer-action-btn">VER PERFIL</button>
        </div>

        <div className="carousel-wrapper">
          <button className="carousel-btn left" onClick={prevImg}><ChevronLeft size={20} /></button>
          <div className="producer-carousel">
            <img src={producer.images[currentImgIndex]} alt={`${producer.name} }`} className="producer-img" />
          </div>
          <button className="carousel-btn right" onClick={nextImg}><ChevronRight size={20} /></button>
          <div className="carousel-dots">
            {producer.images.map((_, idx) => (
              <div key={idx} className="carousel-dot" style={{ opacity: idx === currentImgIndex ? 1 : 0.3 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProducersPage = () => {
  const [producers, setProducers] = useState([]);

  useEffect(() => {
    const fetchProducers = async () => {
      const data = await getProducers();
      setProducers(data);
    };
    fetchProducers();
  }, []);

  return (
    <div className="producers-page-container">
      <div className="content-wrapper">
        {producers.map(prod => (
          <ProducerCard key={prod.id} producer={prod} />
        ))}
      </div>
    </div>
  );
};

export default ProducersPage;
