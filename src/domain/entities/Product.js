/**
 * Product Domain Entity
 * Represents a product with business rules
 */

export class Product {
  constructor({ id, name, category, price, stock, minStock, description }) {
    this.id = id
    this.name = name
    this.category = category
    this.price = price
    this.stock = stock || 0
    this.minStock = minStock || 0
    this.description = description
  }

  /**
   * Business rule: Check if product is low in stock
   */
  isLowStock() {
    return this.stock <= this.minStock
  }

  /**
   * Business rule: Check if product is available
   */
  isAvailable(quantity = 1) {
    return this.stock >= quantity
  }

  /**
   * Business rule: Validate product
   */
  static validate(productData) {
    if (!productData.name) {
      throw new Error('Product must have a name')
    }
    if (!productData.price || productData.price <= 0) {
      throw new Error('Product must have a valid price')
    }
    return true
  }
}

