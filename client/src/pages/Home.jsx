import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Estado para productos destacados (ejemplo)
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Simula carga de datos (luego lo reemplazarás con tu API)
  useEffect(() => {
    const loadProducts = async () => {
      // Datos de ejemplo (elimina esto cuando conectes el backend)
      const mockProducts = [
        { id: 1, name: "Martillo Profesional", price: 15000, image: "/tools/hammer.jpg" },
        { id: 2, name: "Destornillador Set", price: 8000, image: "/tools/screwdriver.jpg" },
      ];
      setFeaturedProducts(mockProducts);
    };
    loadProducts();
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Banner */}
      <header style={styles.hero}>
        <h1 style={styles.heroTitle}>Ferretería Los Plataformeros</h1>
        <p style={styles.heroSubtitle}>Herramientas y materiales de calidad para profesionales y hogar</p>
        <Link to="/productos" style={styles.ctaButton}>Ver Catálogo</Link>
      </header>

      {/* Productos Destacados */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Productos Destacados</h2>
        <div style={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <div key={product.id} style={styles.productCard}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={styles.productImage}
              />
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productPrice}>${product.price.toLocaleString('es-CL')}</p>
              <button style={styles.addToCartButton}>Añadir al carrito</button>
            </div>
          ))}
        </div>
      </section>

      {/* Llamado a la acción */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaText}>¿Necesitas asesoría técnica?</h2>
        <Link to="/contacto" style={styles.ctaButtonSecondary}>Contáctanos</Link>
      </section>
    </div>
  );
};

// Estilos en objeto JS (puedes moverlos a CSS modules luego)
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    color: '#333',
  },
  hero: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '60px 20px',
    textAlign: 'center',
    borderRadius: '8px',
    marginBottom: '40px',
  },
  heroTitle: {
    fontSize: '2.5rem',
    marginBottom: '10px',
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '20px',
  },
  ctaButton: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#f59e0b',
    color: 'white',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  section: {
    marginBottom: '50px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
  },
  productImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '15px',
  },
  productName: {
    fontSize: '1.1rem',
    margin: '10px 0',
  },
  productPrice: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1e3a8a',
    margin: '10px 0',
  },
  addToCartButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
  },
  ctaSection: {
    backgroundColor: '#f0fdf4',
    padding: '40px 20px',
    textAlign: 'center',
    borderRadius: '8px',
  },
  ctaText: {
    marginBottom: '20px',
  },
  ctaButtonSecondary: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Home;