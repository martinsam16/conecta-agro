import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getCategoryProducts, searchProducts, getCategories } from '../services/api';
import { Calculator, MapPin, FileText, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

   const navigate = useNavigate();
   const [products, setProducts] = useState([]);
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(true);
   const [sortOrder, setSortOrder] = useState('relevancia');
   const [priceFilter, setPriceFilter] = useState({ min: null, max: null });
   const [minInput, setMinInput] = useState('');
   const [maxInput, setMaxInput] = useState('');
   const [selectedProducer, setSelectedProducer] = useState('todos los productores');

   useEffect(() => {
      const fetchCats = async () => {
         const cats = await getCategories();
         setCategories(cats);
      };
      fetchCats();
   }, []);

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

   const handlePriceApply = () => {
      setPriceFilter({
         min: minInput ? parseFloat(minInput) : null,
         max: maxInput ? parseFloat(maxInput) : null
      });
   };

   const handleResetFilters = () => {
      setPriceFilter({ min: null, max: null });
      setMinInput('');
      setMaxInput('');
      setSelectedProducer('todos los productores');
      setSortOrder('relevancia');
      if (categoryName || searchQuery) {
         navigate('/categorias');
      }
   };

   const handleRangeClick = (min, max) => {
      setPriceFilter({ min, max });
      setMinInput(min || '');
      setMaxInput(max || '');
   };

   const filteredProducts = products.filter(p => {
      const price = parseFloat(p.price || 0);
      if (priceFilter.min !== null && price < priceFilter.min) return false;
      if (priceFilter.max !== null && price > priceFilter.max) return false;
      if (selectedProducer && selectedProducer.toLowerCase() !== 'todos los productores' && p.producer !== selectedProducer) return false;
      return true;
   });

   const uniqueProducers = [...new Set(products.map(p => p.producer))].filter(Boolean);

   const sortedProducts = [...filteredProducts].sort((a, b) => {
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
               <div className="sidebar-filter-dropdown-wrapper">
                  <select
                     className="sidebar-filter-select"
                     value={categoryName || 'todas las categorías'}
                     onChange={(e) => navigate(`/categorias/${e.target.value}`)}
                     disabled={!!searchQuery}
                  >
                     <option value="todas las categorías">Todas las categorías</option>
                     {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                     ))}
                  </select>
                  {!searchQuery && <ChevronDown size={16} className="dropdown-arrow-icon" />}
               </div>
            </div>

            <div className="sidebar-filter-group price-filter-group">
               <h3 className="sidebar-filter-title">Precios</h3>
               <ul className="price-ranges-list">
                  <li
                     className={!priceFilter.min && priceFilter.max === 1.5 ? 'active' : ''}
                     onClick={() => handleRangeClick(null, 1.5)}
                  >
                     Hasta S/ 1.5
                  </li>
                  <li
                     className={priceFilter.min === 1.5 && priceFilter.max === 2.5 ? 'active' : ''}
                     onClick={() => handleRangeClick(1.5, 2.5)}
                  >
                     S/ 1.5 a S/ 2.5
                  </li>
                  <li
                     className={priceFilter.min === 2.5 && !priceFilter.max ? 'active' : ''}
                     onClick={() => handleRangeClick(2.5, null)}
                  >
                     Más de S/ 2.5
                  </li>
               </ul>
               <div className="manual-price-container">
                  <input
                     type="number"
                     placeholder="Mínimo"
                     className="price-input"
                     value={minInput}
                     onChange={(e) => setMinInput(e.target.value)}
                  />
                  <span className="price-sep">—</span>
                  <input
                     type="number"
                     placeholder="Máximo"
                     className="price-input"
                     value={maxInput}
                     onChange={(e) => setMaxInput(e.target.value)}
                  />
                  <button className="price-go-btn" onClick={handlePriceApply}>
                     <ChevronDown size={18} style={{ transform: 'rotate(-90deg)' }} />
                  </button>
               </div>
            </div>

            <div className="sidebar-filter-group">
               <h3 className="sidebar-filter-title">Productor</h3>
               <div className="sidebar-filter-dropdown-wrapper">
                  <select 
                     className="sidebar-filter-select"
                     value={selectedProducer} 
                     onChange={(e) => setSelectedProducer(e.target.value)}
                  >
                     <option value="todos los productores">Todos los productores</option>
                     {uniqueProducers.map(prodName => (
                        <option key={prodName} value={prodName}>{prodName}</option>
                     ))}
                  </select>
                  <ChevronDown size={16} className="dropdown-arrow-icon" />
               </div>
            </div>

            <div className="sidebar-filter-group">
               <h3 className="sidebar-filter-title">Ubicación</h3>
            </div>

            <button className="reset-filters-btn" onClick={handleResetFilters}>
               Reiniciar Filtros
            </button>
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
                           <div className="cat-card-price">PRECIO: S/. {prod.price}</div>

                           <ul className="cat-card-list">
                              <li>
                                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'darkgreen', marginTop: '4px' }}></div>
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
