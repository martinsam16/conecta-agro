import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import ProductSection from './components/ProductSection';
import Recommendations from './components/Recommendations';
import Footer from './components/Footer';
import MobileMenu from './components/MobileMenu';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import ProducersPage from './components/ProducersPage';
import './App.css';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (page) => {
    setIsMobileMenuOpen(false);
    if (page === 'Inicio') navigate('/');
    else if (page === 'Categorías') navigate('/categorias');
    else if (page === 'Productores') navigate('/productores');
    else if (page === 'Contacta') {
      navigate('/#contact-section');
    }
    else navigate('/en-construccion');
  };

  return (
    <div className="app-container">
      <div className="top-background">
        <div className="content-wrapper">
          <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
          <Navbar />
        </div>
      </div>
      
      <main className="main-content" style={{ padding: location.pathname === '/' ? 0 : undefined }}>
        <Routes>
          <Route path="/" element={<HomePage onSelectProduct={(cat) => navigate(`/categorias/${cat.toLowerCase()}`)} />} />
          <Route path="/categorias" element={<CategoryPage onSelectProductItem={(item) => navigate(`/producto/${item.id}`)} />} />
          <Route path="/categorias/:categoryName" element={<CategoryPage onSelectProductItem={(item) => navigate(`/producto/${item.id}`)} />} />
          <Route path="/productores" element={<ProducersPage />} />
          <Route path="/producto/:productId" element={
            <div className="white-background-wrapper">
              <div className="content-wrapper">
                <ProductSection />
                <Recommendations />
              </div>
            </div>
          } />
          <Route path="*" element={
            <div className="white-background-wrapper">
              <div className="content-wrapper">
                <div style={{ padding: '60px 20px', minHeight: '50vh', textAlign: 'center' }}>
                  <h2>Página en construcción</h2>
                  <p style={{ marginTop: '20px', color: '#666' }}>Esta sección estará disponible pronto.</p>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </main>

      <Footer />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        onNavigate={handleNavigate} 
      />
    </div>
  );
}

export default App;
