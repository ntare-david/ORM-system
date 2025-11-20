/**
 * Token Service (Infrastructure)
 * Handles token storage and retrieval
 */

export class TokenService {
  setToken(token) {
    localStorage.setItem('auth_token', token)
  }

  getToken() {
    return localStorage.getItem('auth_token')
  }

  removeToken() {
    localStorage.removeItem('auth_token')
  }

  hasToken() {
    return !!this.getToken()
  }
}

