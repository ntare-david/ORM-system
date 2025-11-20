/**
 * Product Repository (Infrastructure)
 * Adapter for product API calls
 */

export class ProductRepository {
  constructor(apiClient) {
    this.apiClient = apiClient
  }

  async findAll() {
    const response = await this.apiClient.get('/sales/products')
    return response.data || []
  }

  async findById(id) {
    const response = await this.apiClient.get(`/sales/products/${id}`)
    return response.data
  }

  async create(product) {
    const response = await this.apiClient.post('/sales/products', product)
    return response.data
  }

  async update(id, product) {
    const response = await this.apiClient.put(`/sales/products/${id}`, product)
    return response.data
  }

  async delete(id) {
    await this.apiClient.delete(`/sales/products/${id}`)
  }
}

