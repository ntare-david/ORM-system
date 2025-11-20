/**
 * Infrastructure API Export
 */

import { ApiClient } from './ApiClient'

// Create singleton instance
export const apiClient = new ApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
})

export { ApiClient }

