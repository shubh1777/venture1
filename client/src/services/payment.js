import api from './api';

export const createOrder = async (plan) => {
  const response = await api.post('/payment/create-order', { plan });
  return response.data;
};

export const processPayment = async (paymentData) => {
  const response = await api.post('/payment/process', paymentData);
  return response.data;
};

export const getPaymentHistory = async () => {
  const response = await api.get('/payment/history');
  return response.data;
};
