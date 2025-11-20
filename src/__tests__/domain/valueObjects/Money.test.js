/**
 * Money Value Object Unit Tests
 */

import { Money } from '../../../domain/valueObjects'

describe('Money Value Object', () => {
  it('should create money with amount and currency', () => {
    const money = new Money(100, 'USD')
    expect(money.amount).toBe(100)
    expect(money.currency).toBe('USD')
  })

  it('should add two money values', () => {
    const money1 = new Money(100, 'USD')
    const money2 = new Money(50, 'USD')
    const result = money1.add(money2)

    expect(result.amount).toBe(150)
    expect(result.currency).toBe('USD')
  })

  it('should throw error when adding different currencies', () => {
    const money1 = new Money(100, 'USD')
    const money2 = new Money(50, 'EUR')

    expect(() => money1.add(money2)).toThrow('Cannot add money with different currencies')
  })

  it('should format money for display', () => {
    const money = new Money(1234.56, 'USD')
    const formatted = money.format()

    expect(formatted).toContain('$1,234.56')
  })
})

