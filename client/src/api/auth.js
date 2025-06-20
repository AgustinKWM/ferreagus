// src/api/auth.js
import api from './config';

export const register = async (userData) => {
  try {
    const { data } = await api.post('/auth/register', {
      username: userData.username,
      email: userData.email,
      password: userData.password
    });
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (credentials) => {
  try {
    const { data } = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user)); // Guardar datos básicos del usuario
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};