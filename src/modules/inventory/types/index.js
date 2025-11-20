/**
 * Inventory Module Types
 */

/**
 * @typedef {Object} StockItem
 * @property {string} id
 * @property {string} item
 * @property {string} location
 * @property {number} quantity
 * @property {number} min_level
 * @property {string} status - 'OK' | 'Low' | 'Out'
 */

/**
 * @typedef {Object} StockMove
 * @property {string} id
 * @property {string} item
 * @property {string} from_location
 * @property {string} to_location
 * @property {number} quantity
 * @property {Date|string} date
 */

/**
 * @typedef {Object} StockPicking
 * @property {string} id
 * @property {string} order_id
 * @property {string} item
 * @property {number} quantity
 * @property {string} status
 * @property {Date|string} date
 */

export {}

