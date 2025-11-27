import sqlite3 from 'sqlite3'
import { promisify } from 'util'

const db = new sqlite3.Database('orm.db')

// Promisify database methods
db.getAsync = promisify(db.get.bind(db))
db.allAsync = promisify(db.all.bind(db))
db.runAsync = promisify(db.run.bind(db))

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      company TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
})

export default db