import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const createProduct = async (product) => {
  const response = await api.post('/products', product);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const scanBarcode = async ({ barcode, action = 'OUT', quantity = 1 }) => {
  const response = await api.post('/scan', { barcode, action, quantity });
  return response.data;
};

export const getLogs = async () => {
  const response = await api.get('/logs');
  return response.data;
};
