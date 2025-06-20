import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (credentials) => {
  try {
    const data = await loginService(credentials);
    setUser(data.user);
    
    // Redirección basada en el tipo de usuario
    console.log('Tipo de usuario:', data.user.tipo); // Para depuración
    
    switch(parseInt(data.user.tipo)) { // Asegurarse que es número
      case 1: // Admin
        navigate('/admin/UserManagement');
        break;
      case 2: // Empleado
        navigate('/employee/productmanagement');
        break;
      case 3: // Cliente
        navigate('/');
        break;
      default:
        navigate('/admin/UserManagement');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

  const register = async (userData) => {
    try {
      const data = await registerService(userData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    navigate('/login');
  };

  const isAdmin = user?.tipo === 1;
  const isEmployee = user?.tipo === 2;
  const isClient = user?.tipo === 3;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAdmin,
      isEmployee,
      isClient,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);