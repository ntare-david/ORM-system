/**
 * API Client (Infrastructure)
 * HTTP client adapter
 */

import axios from 'axios'
import { handleApiError } from '../../utils/errorHandler'

export class ApiClient {
  constructor(config = {}) {
    this.client = axios.create({
      baseURL: config.baseURL || 'http://localhost:8000/api',
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
        }
        
        // Enhance error message for network errors
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
          error.message = 'Unable to connect to the server. Please check your internet connection and ensure the backend server is running.'
        }
        
        return Promise.reject(handleApiError(error))
      }
    )
  }

  setToken(token) {
    localStorage.setItem('auth_token', token)
  }

  getToken() {
    return localStorage.getItem('auth_token')
  }

  removeToken() {
    localStorage.removeItem('auth_token')
  }

  async get(url, config) {
    return await this.client.get(url, config)
  }

  async post(url, data, config) {
    return await this.client.post(url, data, config)
  }

  async put(url, data, config) {
    return await this.client.put(url, data, config)
  }

  async delete(url, config) {
    return await this.client.delete(url, config)
  }
}

