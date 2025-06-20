import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAdmin, isEmployee, isClient } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;

  // Verificar roles
  const userRole = user.tipo;
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    // Redirigir a la página principal según el rol
    if (isAdmin) return <Navigate to="/admin/usermanagement" replace />;
    if (isEmployee) return <Navigate to="/employee/productmanagement" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};