/**
 * Auth Repository (Infrastructure)
 * Adapter for authentication API calls
 */

export class AuthRepository {
  constructor(apiClient) {
    this.apiClient = apiClient
  }

  async login(email, password) {
    const response = await this.apiClient.post('/auth/login', { email, password })
    return response.data
  }

  async signup(userData) {
    const response = await this.apiClient.post('/auth/signup', userData)
    return response.data
  }

  async getCurrentUser() {
    const response = await this.apiClient.get('/auth/me')
    return response.data
  }
}

