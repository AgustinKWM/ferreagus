// src/pages/ProductCatalog.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import { FaSearch, FaFilter, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useCart } from '../context/cartContext';
import "../styles/ProductCatalog.css";

export const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(filters);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const filteredProducts = products.filter(product =>
    product?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product?.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Cargando productos...</div>;

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h1>Catálogo de Productos</h1>

        <div className="search-filter-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit">Buscar</button>
          </form>

          <div className="filter-section">
            <button className="filter-toggle">
              <FaFilter /> Filtros
            </button>
            <div className="filter-dropdown">
              <div className="filter-group">
                <label>Categoría:</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="">Todas</option>
                  <option value="Herramientas manuales">Herramientas</option>
                  <option value="Materiales eléctricos">Eléctricos</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Precio mínimo:</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  placeholder="Mínimo"
                />
              </div>
              <div className="filter-group">
                <label>Precio máximo:</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  placeholder="Máximo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.idProducto || product.id} className="product-card">
              <Link to={`/products/${product.idProducto}`}>
                <div className="product-image-container">
                  <img 
                    src={product.imagen || '/placeholder-product.jpg'} 
                    alt={product.nombre || 'Producto sin nombre'}
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  <button className="quick-view">Vista rápida</button>
                </div>
              </Link>

              <div className="product-info">
                <h3>{product.nombre || 'Sin nombre'}</h3>
                <div className="product-meta">
                  <span className="product-category">{product.categoria || 'Sin categoría'}</span>
                  <div className="product-rating">
                    <FaStar className="star-icon" />
                    <span>4.5</span>
                  </div>
                </div>
                <div className="product-footer">
                  <span className="product-price">
                    ${Number(product.precio || 0).toLocaleString()}
                  </span>
                  <button 
                    className="add-to-cart"
                    onClick={() => addToCart(product)}
                    title="Agregar al carrito"
                  >
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
};
