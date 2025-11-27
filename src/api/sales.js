import { apiClient } from './client'

export const salesApi = {
  getProducts: () => apiClient.get('/sales/products'),
  createProduct: (data) => apiClient.post('/sales/products', data),
  updateProduct: (id, data) => apiClient.put(`/sales/products/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`/sales/products/${id}`),

  getOrders: () => apiClient.get('/sales/orders'),
  createOrder: (data) => apiClient.post('/sales/orders', data),
  updateOrder: (id, data) => apiClient.put(`/sales/orders/${id}`, data),
  deleteOrder: (id) => apiClient.delete(`/sales/orders/${id}`),

  getPricelists: () => apiClient.get('/sales/pricelists'),
  createPricelist: (data) => apiClient.post('/sales/pricelists', data),
  updatePricelist: (id, data) => apiClient.put(`/sales/pricelists/${id}`, data),
  deletePricelist: (id) => apiClient.delete(`/sales/pricelists/${id}`),
}

