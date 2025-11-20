/**
 * Invoice Repository (Infrastructure)
 * Adapter for invoice API calls
 */

export class InvoiceRepository {
  constructor(apiClient) {
    this.apiClient = apiClient
  }

  async findAll() {
    const response = await this.apiClient.get('/accounting/invoices')
    return response.data || []
  }

  async findById(id) {
    const response = await this.apiClient.get(`/accounting/invoices/${id}`)
    return response.data
  }

  async create(invoice) {
    const response = await this.apiClient.post('/accounting/invoices', invoice)
    return response.data
  }

  async update(id, invoice) {
    const response = await this.apiClient.put(`/accounting/invoices/${id}`, invoice)
    return response.data
  }

  async delete(id) {
    await this.apiClient.delete(`/accounting/invoices/${id}`)
  }
}

