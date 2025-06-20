// src/api/products.js
import api from './config';

export const getProducts = async (filters = {}) => {
  try {
    const { data } = await api.get('/productos', { params: filters });
    return data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProductById = async (id) => {
  try {
    const { data } = await api.get(`/productos/${id}`);
    return data;
  } catch (error) {
    throw error.response.data;
  }
};  