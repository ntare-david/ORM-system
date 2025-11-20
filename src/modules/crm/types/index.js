/**
 * CRM Module Types
 */

/**
 * @typedef {Object} Lead
 * @property {string} id
 * @property {string} name
 * @property {string} company
 * @property {string} email
 * @property {string} phone
 * @property {string} status - 'new' | 'qualified' | 'contacted' | 'converted' | 'lost'
 * @property {number} [value]
 * @property {Date|string} [createdAt]
 */

/**
 * @typedef {Object} Opportunity
 * @property {string} id
 * @property {string} title
 * @property {string} lead_id
 * @property {number} value
 * @property {string} status
 * @property {Date|string} date
 */

/**
 * @typedef {Object} Pipeline
 * @property {string} id
 * @property {string} name
 * @property {number} amount
 * @property {string} stage
 * @property {number} probability
 * @property {Date|string} date
 */

export {}

