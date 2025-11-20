/**
 * Stock API Adapter
 */

import { apiClient } from '../../../infrastructure/api'

export const stockApi = {
  getStock: () => apiClient.get('/inventory/stock'),
  getStockItem: (id) => apiClient.get(`/inventory/stock/${id}`),
  updateStock: (id, data) => apiClient.put(`/inventory/stock/${id}`, data),
  getMoves: () => apiClient.get('/inventory/moves'),
  createMove: (data) => apiClient.post('/inventory/moves', data),
  getPicking: () => apiClient.get('/inventory/picking'),
}

