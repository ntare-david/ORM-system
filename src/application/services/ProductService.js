/**
 * Product Service (Use Case)
 * Orchestrates product business logic
 */

import { Product } from '../../domain/entities'

export class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository
  }

  /**
   * Use Case: Create a new product
   */
  async createProduct(productData) {
    Product.validate(productData)

    const product = new Product({
      ...productData,
      stock: productData.stock || 0,
    })

    return await this.productRepository.create(product)
  }

  /**
   * Use Case: Get all products
   */
  async getProducts() {
    const products = await this.productRepository.findAll()
    return products.map(data => new Product(data))
  }

  /**
   * Use Case: Get low stock products
   */
  async getLowStockProducts() {
    const products = await this.getProducts()
    return products.filter(product => product.isLowStock())
  }

  /**
   * Use Case: Update product stock
   */
  async updateStock(productId, quantity) {
    const product = await this.productRepository.findById(productId)
    if (!product) {
      throw new Error('Product not found')
    }

    const updatedProduct = new Product({
      ...product,
      stock: product.stock + quantity,
    })

    return await this.productRepository.update(productId, updatedProduct)
  }
}

