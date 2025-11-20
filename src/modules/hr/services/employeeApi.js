/**
 * Employee API Adapter
 */

import { apiClient } from '../../../infrastructure/api'

export const employeeApi = {
  getEmployees: () => apiClient.get('/hr/employees'),
  getEmployee: (id) => apiClient.get(`/hr/employees/${id}`),
  createEmployee: (data) => apiClient.post('/hr/employees', data),
  updateEmployee: (id, data) => apiClient.put(`/hr/employees/${id}`, data),
  getAttendance: () => apiClient.get('/hr/attendance'),
  getLeaves: () => apiClient.get('/hr/leaves'),
}

