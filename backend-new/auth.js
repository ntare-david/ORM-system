import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from './database.js'

const JWT_SECRET = 'your-secret-key'

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' })
}

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET)
}

export const signup = async (email, password, name) => {
  const existingUser = await db.getAsync('SELECT * FROM users WHERE email = ?', [email])
  if (existingUser) {
    throw new Error('Email already registered')
  }

  const hashedPassword = await hashPassword(password)
  const userId = 'user_' + Date.now()
  
  await db.runAsync(
    'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
    [userId, email, hashedPassword, name]
  )

  const user = await db.getAsync('SELECT id, email, name, role, company FROM users WHERE id = ?', [userId])
  const token = generateToken(userId)

  return { user, token }
}

export const login = async (email, password) => {
  const user = await db.getAsync('SELECT * FROM users WHERE email = ?', [email])
  if (!user) {
    throw new Error('Invalid credentials')
  }

  const isValid = await comparePassword(password, user.password)
  if (!isValid) {
    throw new Error('Invalid credentials')
  }

  const token = generateToken(user.id)
  const { password: _, ...userWithoutPassword } = user

  return { user: userWithoutPassword, token }
}