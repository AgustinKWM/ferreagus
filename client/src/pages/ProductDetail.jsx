// src/pages/ProductDetail.jsx
import { useParams } from 'react-router-dom';

export const ProductDetail = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h1>Detalle del Producto {id}</h1>
      {/* Aquí iría el contenido detallado del producto */}
    </div>
  );
};