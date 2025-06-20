// src/api/profile.js
import api from './config';

export const updateProfile = async (userId, updates) => {
  try {
    const { data } = await api.put(`/usuarios/profile/${userId}`, updates);
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const { data } = await api.put(`/usuarios/change-password/${userId}`, {
      currentPassword,
      newPassword
    });
    return data;
  } catch (error) {
    throw error.response.data;
  }
};