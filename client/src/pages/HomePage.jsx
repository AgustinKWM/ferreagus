// src/pages/HomePage.jsx
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <Navbar />
      <main className="main-content">
        <section className="hero-section">
          <h1>Bienvenido a Ferremas</h1>
          <p>Tu ferretería de confianza con los mejores precios</p>
          {!user && (
            <div className="auth-buttons">
              <a href="/login" className="btn btn-primary">Iniciar sesión</a>
              <a href="/register" className="btn btn-secondary">Registrarse</a>
            </div>
          )}
        </section>

        <section className="featured-products">
          <h2>Productos destacados</h2>
          <div className="product-grid">
            {/* Los productos se cargarán aquí */}
          </div>
        </section>
      </main>
    </div>
  );
};