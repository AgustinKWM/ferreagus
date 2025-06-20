// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.imagen || '/placeholder-product.jpg'} alt={product.nombre} />
      <h3>{product.nombre}</h3>
      <p>${product.precio}</p>
      <Link to={`/products/${product.id}`} className="btn btn-primary">
        Ver detalles
      </Link>
    </div>
  );
};