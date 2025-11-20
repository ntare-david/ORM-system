/**
 * Service Container (Dependency Injection)
 * Centralized service initialization and dependency management
 */

import { ApiClient } from './api/ApiClient'
import { TokenService } from './services/TokenService'
import { InvoiceRepository, ProductRepository, AuthRepository } from './repositories'
import { InvoiceService, ProductService, AuthService } from '@application/services'

class ServiceContainer {
  constructor() {
    // Infrastructure
    this.apiClient = new ApiClient({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    })
    this.tokenService = new TokenService()

    // Repositories
    this.invoiceRepository = new InvoiceRepository(this.apiClient)
    this.productRepository = new ProductRepository(this.apiClient)
    this.authRepository = new AuthRepository(this.apiClient)

    // Services (Use Cases)
    this.invoiceService = new InvoiceService(this.invoiceRepository)
    this.productService = new ProductService(this.productRepository)
    this.authService = new AuthService(this.authRepository, this.tokenService)
  }

  // Getters for services
  getInvoiceService() {
    return this.invoiceService
  }

  getProductService() {
    return this.productService
  }

  getAuthService() {
    return this.authService
  }

  getApiClient() {
    return this.apiClient
  }
}

// Singleton instance
export const serviceContainer = new ServiceContainer()

