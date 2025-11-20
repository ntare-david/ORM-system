/**
 * Company Domain Entity
 * Represents a company with business rules
 */

export class Company {
  constructor({ id, name, email, address, phone, settings = {} }) {
    this.id = id
    this.name = name
    this.email = email
    this.address = address
    this.phone = phone
    this.settings = settings
  }

  /**
   * Business rule: Validate company data
   */
  static validate(companyData) {
    if (!companyData.name) {
      throw new Error('Company must have a name')
    }
    return true
  }
}

