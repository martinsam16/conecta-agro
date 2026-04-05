import React from 'react';
import { Heart, Users, Target, Globe } from 'lucide-react';
import './HomePage.css';

const HomePage = ({ onSelectProduct }) => {
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
      <section className="contact-section">
        <img src="https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=300&q=80" alt="Asparagus" className="contact-veggie left" />
        <img src="https://images.unsplash.com/photo-1506802913710-18ebad2936e7?auto=format&fit=crop&w=300&q=80" alt="Chili" className="contact-veggie right" />
        
        <div className="contact-card">
          <h2>CONTACTANOS</h2>
          <p>Escribenos y nos pondremos en contacto a la brevedad</p>
          
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <input type="text" className="contact-input" placeholder="Nombres y apellidos" />
            <input type="email" className="contact-input" placeholder="Correo" />
            <input type="text" className="contact-input" placeholder="Asunto" />
            <textarea className="contact-textarea" placeholder="Mensaje" />
            <button type="submit" className="contact-submit">ENVIAR</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
