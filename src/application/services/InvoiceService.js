/**
 * Invoice Service (Use Case)
 * Orchestrates invoice business logic
 */

import { Invoice } from '@domain/entities'

export class InvoiceService {
  constructor(invoiceRepository) {
    this.invoiceRepository = invoiceRepository
  }

  /**
   * Use Case: Create a new invoice
   */
  async createInvoice(invoiceData) {
    // Validate business rules
    Invoice.validate(invoiceData)

    // Create domain entity
    const invoice = new Invoice({
      ...invoiceData,
      status: invoiceData.status || 'pending',
      date: new Date(),
    })

    // Persist through repository
    return await this.invoiceRepository.create(invoice)
  }

  /**
   * Use Case: Get all invoices
   */
  async getInvoices() {
    const invoices = await this.invoiceRepository.findAll()
    return invoices.map(data => new Invoice(data))
  }

  /**
   * Use Case: Get invoice by ID
   */
  async getInvoiceById(id) {
    const data = await this.invoiceRepository.findById(id)
    return data ? new Invoice(data) : null
  }

  /**
   * Use Case: Update invoice status
   */
  async updateInvoiceStatus(id, status) {
    const invoice = await this.getInvoiceById(id)
    if (!invoice) {
      throw new Error('Invoice not found')
    }

    invoice.status = status
    return await this.invoiceRepository.update(id, invoice)
  }

  /**
   * Use Case: Mark invoice as paid
   */
  async markAsPaid(id) {
    const invoice = await this.getInvoiceById(id)
    if (!invoice) {
      throw new Error('Invoice not found')
    }

    if (!invoice.canBePaid()) {
      throw new Error('Invoice cannot be paid in current status')
    }

    return await this.updateInvoiceStatus(id, 'paid')
  }
}

