/**
 * Lead API Adapter
 */

import { apiClient } from '../../../infrastructure/api'

export const leadApi = {
  getLeads: () => apiClient.get('/crm/leads'),
  getLead: (id) => apiClient.get(`/crm/leads/${id}`),
  createLead: (data) => apiClient.post('/crm/leads', data),
  updateLead: (id, data) => apiClient.put(`/crm/leads/${id}`, data),
  deleteLead: (id) => apiClient.delete(`/crm/leads/${id}`),
}

