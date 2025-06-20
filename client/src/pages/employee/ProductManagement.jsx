// src/pages/employee/ProductManagement.jsx
import { useState, useEffect } from 'react';
import api from '../../api/config';
import "../../styles/EmployeeStyles.css";

export const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/productos');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('¿Eliminar este producto?')) {
      try {
        await api.delete(`/productos/${productId}`);
        setProducts(products.filter(product => product.idProducto !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div className="employee-container">
      <h2>Gestión de Productos</h2>
      <div className="product-actions">
        <a href="/employee/products/new" className="btn-add">+ Nuevo Producto</a>
      </div>
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.idProducto}>
              <td>{product.idProducto}</td>
              <td>{product.nombre}</td>
              <td>${product.precio}</td>
              <td>{product.stock}</td>
              <td>
                <a href={`/employee/products/edit/${product.idProducto}`} className="btn-edit">Editar</a>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(product.idProducto)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};