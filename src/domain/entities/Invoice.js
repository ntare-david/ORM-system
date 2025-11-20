/**
 * Invoice Domain Entity
 * Represents an invoice with business rules
 */

export class Invoice {
  constructor({ id, customer, amount, status, date, dueDate, items = [] }) {
    this.id = id
    this.customer = customer
    this.amount = amount
    this.status = status
    this.date = date ? new Date(date) : new Date()
    this.dueDate = dueDate ? new Date(dueDate) : null
    this.items = items
  }

  /**
   * Business rule: Check if invoice is overdue
   */
  isOverdue() {
    if (!this.dueDate || this.status === 'paid') return false
    return new Date() > this.dueDate
  }

  /**
   * Business rule: Check if invoice can be paid
   */
  canBePaid() {
    return this.status === 'pending' || this.status === 'overdue'
  }

  /**
   * Business rule: Calculate total amount
   */
  calculateTotal() {
    if (this.items.length > 0) {
      return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }
    return this.amount || 0
  }

  /**
   * Business rule: Validate invoice
   */
  static validate(invoiceData) {
    if (!invoiceData.customer) {
      throw new Error('Invoice must have a customer')
    }
    if (!invoiceData.amount || invoiceData.amount <= 0) {
      throw new Error('Invoice must have a valid amount')
    }
    return true
  }
}

