// src/pages/client/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, changePassword } from '../../api/profile';
import "../../styles/ProfileStyles.css";

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user.id, formData);
      setMessage('Perfil actualizado correctamente');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message || 'Error al actualizar perfil');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
    
    try {
      await changePassword(user.id, passwordData.currentPassword, passwordData.newPassword);
      setMessage('Contraseña cambiada correctamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.message || 'Error al cambiar contraseña');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Mi Perfil</h2>
        <div className="tabs">
          <button 
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Información Personal
          </button>
          <button 
            className={activeTab === 'password' ? 'active' : ''}
            onClick={() => setActiveTab('password')}
          >
            Cambiar Contraseña
          </button>
          <button 
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            Historial
          </button>
        </div>
      </div>

      {message && <div className="alert">{message}</div>}

      <div className="tab-content">
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label>Nombre de usuario:</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <button type="submit">Guardar Cambios</button>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Contraseña actual:</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Nueva contraseña:</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Confirmar contraseña:</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
            </div>
            <button type="submit">Cambiar Contraseña</button>
          </form>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <h3>Historial de Compras</h3>
            <p>Aquí aparecerán tus pedidos anteriores</p>
            
            <h3>Búsquedas Recientes</h3>
            <p>Aquí aparecerán tus búsquedas</p>
          </div>
        )}
      </div>
    </div>
  );
};