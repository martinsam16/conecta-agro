import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Heart, Users, Target, Globe } from 'lucide-react';
import './HomePage.css';

const HomePage = ({ onSelectProduct }) => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del correo es inválido';
    }
    if (!formData.subject.trim()) newErrors.subject = 'El asunto es obligatorio';
    if (!formData.message.trim()) newErrors.message = 'El mensaje es obligatorio';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  useEffect(() => {
    if (location.hash === '#contact-section') {
      const element = document.getElementById('contact-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  return (
    <div className="home-page-container">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-main-card">
          <h1>CONECTANDO EL CAMPO CON EL MERCADO</h1>
          <p>
            Conecta Agro es una aplicación web orientada al sector agrícola que permite a pequeños y medianos fundos
            registrar y publicar sus productos (frutas y vegetales), facilitando el contacto directo con compradores
            mediante información clara y actualizada sobre precios, cantidades disponibles y estacionalidad.
          </p>
        </div>
        
        <div className="hero-subcards-wrapper">
          <div className="hero-subcard">
            <h3>CONTACTO DIRECTO</h3>
            <p>Conectamos directamente el origen con el destino final sin intermediarios innecesarios.</p>
          </div>
          <div className="hero-subcard" style={{ transform: 'translateY(20px)' }}>
            <h3>PRECIOS JUSTOS</h3>
            <p>Precios Justos: Visualización de precios en tiempo real basados en la oferta y demanda del mercado actual.</p>
          </div>
          <div className="hero-subcard">
            <h3>SOSTENIBILIDAD</h3>
            <p>Apoyamos a los pequeños y medianos productores para fomentar una economía local sólida.</p>
          </div>
        </div>
      </section>

      {/* VALUES BAR */}
      <section className="values-bar">
        <div className="value-item">
          <div className="value-icon-circle"><Heart size={34} fill="white" /></div>
          <span>about YOU</span>
        </div>
        <div className="value-item">
          <div className="value-icon-circle"><Users size={34} fill="white" /></div>
          <span>about our PEOPLE</span>
        </div>
        <div className="value-item">
          <div className="value-icon-circle"><Target size={34} /></div>
          <span>about COMMUNITIES</span>
        </div>
        <div className="value-item">
          <div className="value-icon-circle"><Globe size={34} fill="white" /></div>
          <span>about the PLANET</span>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="categories-section">
        <div className="category-card" onClick={() => onSelectProduct('Frutas')}>
          <img src="https://images.unsplash.com/photo-1596368708356-6e1e1025ee72?auto=format&fit=crop&w=500&q=80" alt="Frutas" />
          <h3>Frutas</h3>
        </div>
        <div className="category-card" onClick={() => onSelectProduct('Verduras')}>
          <img src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=500&q=80" alt="Verduras" />
          <h3>Verduras</h3>
        </div>
        <div className="category-card" onClick={() => onSelectProduct('Tuberculos')}>
          <img src="https://images.unsplash.com/photo-1518977676366-2287dc37da18?auto=format&fit=crop&w=500&q=80" alt="Tubérculos" />
          <h3>Tuberculos</h3>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact-section" id="contact-section">
        <img src="https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=300&q=80" alt="Asparagus" className="contact-veggie left" />
        <img src="https://images.unsplash.com/photo-1506802913710-18ebad2936e7?auto=format&fit=crop&w=300&q=80" alt="Chili" className="contact-veggie right" />
        
        <div className="contact-card">
          <h2>CONTACTANOS</h2>
          <p>Escribenos y nos pondremos en contacto a la brevedad</p>
          
          {isSubmitted && (
            <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '15px', width: '100%', textAlign: 'center' }}>
              ¡Mensaje enviado con éxito!
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={`contact-input ${errors.name ? 'error' : ''}`} placeholder="Nombres y apellidos" />
              {errors.name && <span style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '10px', textAlign: 'left', paddingLeft: '15px' }}>{errors.name}</span>}
            </div>
            
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={`contact-input ${errors.email ? 'error' : ''}`} placeholder="Correo" />
              {errors.email && <span style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '10px', textAlign: 'left', paddingLeft: '15px' }}>{errors.email}</span>}
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} className={`contact-input ${errors.subject ? 'error' : ''}`} placeholder="Asunto" />
              {errors.subject && <span style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '10px', textAlign: 'left', paddingLeft: '15px' }}>{errors.subject}</span>}
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <textarea name="message" value={formData.message} onChange={handleChange} className={`contact-textarea ${errors.message ? 'error' : ''}`} placeholder="Mensaje" />
              {errors.message && <span style={{ color: '#d9534f', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '10px', textAlign: 'left', paddingLeft: '15px' }}>{errors.message}</span>}
            </div>

            <button type="submit" className="contact-submit">ENVIAR</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
