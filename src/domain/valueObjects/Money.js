/**
 * Money Value Object
 * Represents monetary values with currency
 */

export class Money {
  constructor(amount, currency = 'USD') {
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error('Amount must be a non-negative number')
    }
    this.amount = amount
    this.currency = currency
  }

  /**
   * Add two money values (must be same currency)
   */
  add(other) {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add money with different currencies')
    }
    return new Money(this.amount + other.amount, this.currency)
  }

  /**
   * Subtract two money values
   */
  subtract(other) {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract money with different currencies')
    }
    return new Money(Math.max(0, this.amount - other.amount), this.currency)
  }

  /**
   * Multiply by a factor
   */
  multiply(factor) {
    return new Money(this.amount * factor, this.currency)
  }

  /**
   * Format for display
   */
  format() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount)
  }

  /**
   * Get numeric value
   */
  toNumber() {
    return this.amount
  }

  /**
   * Compare with another money value
   */
  equals(other) {
    return this.amount === other.amount && this.currency === other.currency
  }

  /**
   * Check if greater than
   */
  greaterThan(other) {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare money with different currencies')
    }
    return this.amount > other.amount
  }
}

