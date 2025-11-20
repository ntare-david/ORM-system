/**
 * Auth Service (Use Case)
 * Orchestrates authentication business logic
 */

import { User } from '@domain/entities'

export class AuthService {
  constructor(authRepository, tokenService) {
    this.authRepository = authRepository
    this.tokenService = tokenService
  }

  /**
   * Use Case: Login user
   */
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    const userData = await this.authRepository.login(email, password)
    
    if (!userData) {
      throw new Error('Invalid credentials')
    }

    const user = new User(userData.user)
    const token = userData.token

    // Store token
    this.tokenService.setToken(token)

    return { user, token }
  }

  /**
   * Use Case: Logout user
   */
  async logout() {
    this.tokenService.removeToken()
  }

  /**
   * Use Case: Get current user
   */
  async getCurrentUser() {
    const token = this.tokenService.getToken()
    if (!token) {
      return null
    }

    const userData = await this.authRepository.getCurrentUser()
    return userData ? new User(userData) : null
  }
}

