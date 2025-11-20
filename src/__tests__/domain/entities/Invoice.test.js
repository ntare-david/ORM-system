/**
 * Invoice Entity Unit Tests
 */

import { Invoice } from '../../../domain/entities'

describe('Invoice Entity', () => {
  it('should create an invoice', () => {
    const invoice = new Invoice({
      id: '1',
      customer: 'Test Customer',
      amount: 1000,
      status: 'pending',
      date: '2024-01-01',
    })

    expect(invoice.id).toBe('1')
    expect(invoice.customer).toBe('Test Customer')
    expect(invoice.amount).toBe(1000)
  })

  it('should check if invoice is overdue', () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 10)

    const invoice = new Invoice({
      id: '1',
      customer: 'Test',
      amount: 1000,
      status: 'pending',
      dueDate: pastDate,
    })

    expect(invoice.isOverdue()).toBe(true)
  })

  it('should check if invoice can be paid', () => {
    const invoice = new Invoice({
      id: '1',
      customer: 'Test',
      amount: 1000,
      status: 'pending',
    })

    expect(invoice.canBePaid()).toBe(true)
  })

  it('should validate invoice data', () => {
    expect(() => {
      Invoice.validate({ customer: 'Test' })
    }).toThrow('Invoice must have a valid amount')

    expect(() => {
      Invoice.validate({ amount: 1000 })
    }).toThrow('Invoice must have a customer')
  })
})

