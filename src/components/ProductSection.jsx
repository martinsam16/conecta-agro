import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductDetails } from '../services/api';
import ChatModal from './ChatModal';
import './ProductSection.css';

const ProductSection = () => {
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductDetails(productId);
        setProductData(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div className="product-section" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando producto...</div>;
  }

  if (!productData) {
    return <div className="product-section">No se pudo cargar el producto.</div>;
  }

  const { title, subtitle, producer, years, location, price, currency, images } = productData;

  const handlePrevImage = () => {
    setCurrentImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(0, prev - 1));

  return (
    <div className="product-section">
      <div className="product-details-container">
        
        <h1 className="product-title">
          {title} <span className="product-subtitle">{subtitle}</span>
        </h1>
        
        <div className="product-farmer-info">
          <span>{producer}</span>
          <span className="dot">•</span>
          <span>{years}</span>
          <span className="dot">•</span>
          <span>{location}</span>
        </div>

        <div className="product-gallery">
          <div className="thumbnails">
            {images.map((img, idx) => (
              <div key={idx} className={`thumbnail-item ${idx === currentImageIdx ? 'active' : ''}`} onClick={() => setCurrentImageIdx(idx)}>
                <img src={img} alt={`${title} thumbnail ${idx + 1}`} />
              </div>
            ))}
          </div>
          
          <div className="main-image-container">
            <button className="gallery-nav-btn left" onClick={handlePrevImage}>
              <ChevronLeft size={24} />
            </button>
            <img src={images[currentImageIdx]} alt={title} className="main-image" />
            <button className="gallery-nav-btn right" onClick={handleNextImage}>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="pricing-card-wrapper">
        <div className="pricing-card">
          <div className="price-section">
            <div className="text-sm">Precio</div>
            <div className="price-value">{currency} {price}</div>
          </div>
          
          <div className="divider"></div>
          
          <div className="quantity-section">
             <div className="text-sm">Cantidad</div>
             <div className="quantity-selector">
                <button className="qty-btn" onClick={decreaseQuantity}>-</button>
                <div className="qty-value">{quantity}</div>
                <button className="qty-btn" onClick={increaseQuantity}>+</button>
             </div>
          </div>
          
          <div className="divider"></div>

          <div className="shipping-section">
            <div className="text-sm">Envío</div>
            <p className="shipping-desc">
              Tarifa de envío y fecha de entrega por definir. Chatea con el proveedor para confirmar los detalles.
            </p>
          </div>

          <div className="divider"></div>

          <div className="totals-section">
             <div className="totals-row">
               <span>Subtotal del producto</span>
               <span>{currency} {(price * quantity).toFixed(2)}</span>
             </div>
             <div className="totals-row">
               <span>Total del envío</span>
               <span>S/ 0.00</span>
             </div>
          </div>

          <div className="action-buttons">
             <button className="btn btn-orange">COTIZAR</button>
             <button className="btn btn-orange" onClick={() => setIsChatOpen(true)}>CHATEA AHORA</button>
          </div>

        </div>
      </div>
      
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default ProductSection;
