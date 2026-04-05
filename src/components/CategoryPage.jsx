import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getCategoryProducts, searchProducts } from '../services/api';
import { Calculator, MapPin, FileText } from 'lucide-react';
import './CategoryPage.css';

const CategoryPage = ({ onSelectProductItem }) => {
  const { categoryName } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q');
  
  let displayCategory = '';
  let dropDownLabel = 'Todas las categorías';
  
  if (searchQuery) {
    displayCategory = `Resultados de: "${searchQuery}"`;
    dropDownLabel = 'Filtrado por búsqueda';
  } else {
    displayCategory = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : 'Todas las categorías';
    dropDownLabel = `${displayCategory} frescas`;
  }
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('relevancia');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data = [];
        if (searchQuery) {
          data = await searchProducts(searchQuery);
        } else {
          data = await getCategoryProducts(displayCategory);
        }
        setProducts(data);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryName, searchQuery, displayCategory]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'menor_precio') {
      return parseFloat(a.price || 0) - parseFloat(b.price || 0);
    } else if (sortOrder === 'mayor_precio') {
      return parseFloat(b.price || 0) - parseFloat(a.price || 0);
    }
    return 0;
  });

  return (
    <div className="category-page-container">
      {/* SIDEBAR */}
      <div className="category-sidebar">
         <h2 className="sidebar-heading">{displayCategory}</h2>
         <div className="sidebar-results-count">Resultados ({products.length})</div>
         
         <div className="sidebar-filter-group">
            <h3 className="sidebar-filter-title">{searchQuery ? 'Búsqueda activa' : 'Categoría'}</h3>
            <div className="sidebar-filter-dropdown">
               <span>{dropDownLabel}</span>
               { !searchQuery && <span>▼</span> }
            </div>
         </div>

         <div className="sidebar-filter-group">
            <h3 className="sidebar-filter-title">Precios</h3>
         </div>

         <div className="sidebar-filter-group">
            <h3 className="sidebar-filter-title">Productor</h3>
         </div>

         <div className="sidebar-filter-group">
            <h3 className="sidebar-filter-title">Ubicación</h3>
         </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="category-main">
         <div className="category-top-controls">
            <button className="control-btn">Resultados para: {displayCategory}</button>
            <select 
               className="control-btn"
               value={sortOrder}
               onChange={(e) => setSortOrder(e.target.value)}
               style={{ appearance: 'auto', cursor: 'pointer', fontFamily: 'inherit', paddingRight: '12px' }}
            >
               <option value="relevancia">Ordenar por: Relevancia</option>
               <option value="menor_precio">Menor precio primero</option>
               <option value="mayor_precio">Mayor precio primero</option>
            </select>
         </div>

         {loading ? (
            <div>Cargando resultados...</div>
         ) : (
            <div className="category-grid">
               {sortedProducts.map(prod => (
                  <div key={prod.id} className="category-item-card" onClick={() => onSelectProductItem(prod)}>
                     <div className="category-card-img-wrapper">
                        <img src={prod.imgUrl} alt={prod.title} />
                     </div>
                     <div className="category-card-details">
                        <h3 className="cat-card-title">{prod.title}</h3>
                        <div className="cat-card-price">PRECIO: {prod.price} Kg</div>
                        
                        <ul className="cat-card-list">
                           <li>
                              <div style={{width:'8px', height:'8px', borderRadius:'50%', backgroundColor:'darkgreen', marginTop:'4px'}}></div>
                              <span>{prod.stockStatus === 'DISPONIBLE' ? `DISPONIBLE: ${prod.quantity}` : 'EN STOCK'}</span>
                           </li>
                           {prod.stockStatus !== 'DISPONIBLE' && (
                              <li>
                                 <FileText size={12} className="cat-card-icon" />
                                 <span>CANTIDAD DISPONIBLE: {prod.quantity}</span>
                              </li>
                           )}
                           <li>
                              <FileText size={12} className="cat-card-icon" />
                              <span>PRODUCTOR: {prod.producer}</span>
                           </li>
                           {prod.location && (
                              <li>
                                 <MapPin size={12} className="cat-card-icon" />
                                 <span>UBICACION: {prod.location}</span>
                              </li>
                           )}
                        </ul>

                        <div className="cat-btn-wrapper">
                           <button className="cat-card-btn" onClick={(e) => { e.stopPropagation(); onSelectProductItem(prod); }}>
                              <Calculator size={14} /> COTIZAR
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
};

export default CategoryPage;
