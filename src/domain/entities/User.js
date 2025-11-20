/**
 * User Domain Entity
 * Represents a user in the system with business rules
 */

export class User {
  constructor({ id, email, name, username, role, company, profilePicture }) {
    this.id = id
    this.email = email
    this.name = name
    this.username = username
    this.role = role
    this.company = company
    this.profilePicture = profilePicture
  }

  /**
   * Business rule: Check if user is admin
   */
  isAdmin() {
    return this.role === 'admin'
  }

  /**
   * Business rule: Check if user can manage company
   */
  canManageCompany(companyId) {
    return this.isAdmin() || this.company === companyId
  }

  /**
   * Business rule: Validate user data
   */
  static validate(userData) {
    if (!userData.email || !userData.name) {
      throw new Error('User must have email and name')
    }
    return true
  }
}

