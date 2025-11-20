/**
 * Invoice API Adapter (Infrastructure)
 * Handles API calls for invoices
 */

import { apiClient } from '../../../infrastructure/api'

export const invoiceApi = {
  getInvoices: () => apiClient.get('/accounting/invoices'),
  getInvoice: (id) => apiClient.get(`/accounting/invoices/${id}`),
  createInvoice: (data) => apiClient.post('/accounting/invoices', data),
  updateInvoice: (id, data) => apiClient.put(`/accounting/invoices/${id}`, data),
  deleteInvoice: (id) => apiClient.delete(`/accounting/invoices/${id}`),
  markAsPaid: (id) => apiClient.post(`/accounting/invoices/${id}/pay`),
}

