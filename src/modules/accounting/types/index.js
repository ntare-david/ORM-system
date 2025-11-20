/**
 * Accounting Module Types
 * Type definitions for accounting domain
 */

/**
 * @typedef {Object} Invoice
 * @property {string} id
 * @property {string} customer
 * @property {number} amount
 * @property {string} status - 'pending' | 'paid' | 'overdue' | 'cancelled'
 * @property {Date|string} date
 * @property {Date|string} [dueDate]
 * @property {InvoiceItem[]} [items]
 */

/**
 * @typedef {Object} InvoiceItem
 * @property {string} id
 * @property {string} description
 * @property {number} quantity
 * @property {number} price
 */

/**
 * @typedef {Object} Payment
 * @property {string} id
 * @property {string} invoice_id
 * @property {number} amount
 * @property {string} method - 'cash' | 'card' | 'bank_transfer' | 'check'
 * @property {Date|string} date
 */

/**
 * @typedef {Object} LedgerEntry
 * @property {string} id
 * @property {string} account
 * @property {number} debit
 * @property {number} credit
 * @property {Date|string} date
 * @property {string} description
 */

export {}

