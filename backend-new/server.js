import express from 'express'
import cors from 'cors'
import { signup, login } from './auth.js'

const app = express()
const PORT = 8000

app.use(cors())
app.use(express.json())

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'ORM Management System API', version: '1.0.0' })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' })
})

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body
    const result = await signup(email, password, name)
    res.json(result)
  } catch (error) {
    res.status(400).json({ detail: error.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await login(email, password)
    res.json(result)
  } catch (error) {
    res.status(401).json({ detail: error.message })
  }
})

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

// Simple in-memory storage (use database in production)
const profiles = new Map()
const products = new Map()
const orders = new Map()
const customers = new Map()
const pricelists = new Map()
const invoices = new Map()
const payments = new Map()
const inventory = new Map()
const employees = new Map()
const attendance = new Map()
const leaves = new Map()
const reports = new Map()
const workflows = new Map()
const aiInsights = new Map()
const websites = new Map()

// All categories start empty

app.post('/api/auth/profile', (req, res) => {
  try {
    // In a real app, you'd get user ID from JWT token
    const userId = 'current_user' // Simplified for demo
    profiles.set(userId, req.body)
    res.json({ message: 'Profile saved successfully', data: req.body })
  } catch (error) {
    res.status(400).json({ detail: error.message })
  }
})

app.get('/api/auth/profile', (req, res) => {
  try {
    const userId = 'current_user' // Simplified for demo
    const profile = profiles.get(userId)
    if (!profile) {
      return res.status(404).json({ detail: 'Profile not found' })
    }
    res.json(profile)
  } catch (error) {
    res.status(400).json({ detail: error.message })
  }
})

// Sales endpoints
app.get('/api/sales/products', (req, res) => {
  console.log('GET /api/sales/products called')
  const productList = Array.from(products.values())
  res.json({ data: productList })
})

app.post('/api/sales/products', (req, res) => {
  console.log('POST /api/sales/products called with:', req.body)
  const { name, category, price, stock } = req.body
  const id = Date.now().toString()
  const product = { id, name, category, price: parseFloat(price), stock: parseInt(stock) }
  products.set(id, product)
  res.json(product)
})

app.put('/api/sales/products/:id', (req, res) => {
  const { id } = req.params
  const { name, category, price, stock } = req.body
  if (products.has(id)) {
    const product = { id, name, category, price: parseFloat(price), stock: parseInt(stock) }
    products.set(id, product)
    res.json(product)
  } else {
    res.status(404).json({ error: 'Product not found' })
  }
})

app.delete('/api/sales/products/:id', (req, res) => {
  const { id } = req.params
  if (products.has(id)) {
    products.delete(id)
    res.json({ message: 'Product deleted' })
  } else {
    res.status(404).json({ error: 'Product not found' })
  }
})

app.get('/api/sales/orders', (req, res) => {
  console.log('GET /api/sales/orders called')
  const orderList = Array.from(orders.values())
  res.json({ data: orderList })
})

app.post('/api/sales/orders', (req, res) => {
  console.log('POST /api/sales/orders called with:', req.body)
  const { customer, total, status } = req.body
  const id = Date.now().toString()
  const order = { id, customer, total: parseFloat(total), status, date: new Date().toISOString().split('T')[0] }
  orders.set(id, order)
  res.json(order)
})

app.put('/api/sales/orders/:id', (req, res) => {
  const { id } = req.params
  const { customer, total, status } = req.body
  if (orders.has(id)) {
    const order = { id, customer, total: parseFloat(total), status, date: orders.get(id).date }
    orders.set(id, order)
    res.json(order)
  } else {
    res.status(404).json({ error: 'Order not found' })
  }
})

app.delete('/api/sales/orders/:id', (req, res) => {
  const { id } = req.params
  if (orders.has(id)) {
    orders.delete(id)
    res.json({ message: 'Order deleted' })
  } else {
    res.status(404).json({ error: 'Order not found' })
  }
})

// CRM endpoints
app.get('/api/crm/customers', (req, res) => {
  console.log('GET /api/crm/customers called')
  const customerList = Array.from(customers.values())
  res.json({ data: customerList })
})

app.post('/api/crm/customers', (req, res) => {
  console.log('POST /api/crm/customers called with:', req.body)
  const { name, email, phone } = req.body
  const id = Date.now().toString()
  const customer = { id, name, email, phone }
  customers.set(id, customer)
  res.json(customer)
})

app.put('/api/crm/customers/:id', (req, res) => {
  const { id } = req.params
  const { name, email, phone } = req.body
  if (customers.has(id)) {
    const customer = { id, name, email, phone }
    customers.set(id, customer)
    res.json(customer)
  } else {
    res.status(404).json({ error: 'Customer not found' })
  }
})

app.delete('/api/crm/customers/:id', (req, res) => {
  const { id } = req.params
  if (customers.has(id)) {
    customers.delete(id)
    res.json({ message: 'Customer deleted' })
  } else {
    res.status(404).json({ error: 'Customer not found' })
  }
})

// Sales - Pricelists
app.get('/api/sales/pricelists', (req, res) => {
  const pricelistList = Array.from(pricelists.values())
  res.json({ data: pricelistList })
})

app.post('/api/sales/pricelists', (req, res) => {
  const { name, currency, validFrom, validTo } = req.body
  const id = Date.now().toString()
  const pricelist = { id, name, currency, validFrom, validTo }
  pricelists.set(id, pricelist)
  res.json(pricelist)
})

// Accounting endpoints
app.get('/api/accounting/invoices', (req, res) => {
  const invoiceList = Array.from(invoices.values())
  res.json({ data: invoiceList })
})

app.post('/api/accounting/invoices', (req, res) => {
  const { customer, amount, dueDate, status } = req.body
  const id = Date.now().toString()
  const invoice = { id, customer, amount: parseFloat(amount), dueDate, status, date: new Date().toISOString().split('T')[0] }
  invoices.set(id, invoice)
  res.json(invoice)
})

app.get('/api/accounting/payments', (req, res) => {
  const paymentList = Array.from(payments.values())
  res.json({ data: paymentList })
})

app.post('/api/accounting/payments', (req, res) => {
  const { customer, amount, method, reference } = req.body
  const id = Date.now().toString()
  const payment = { id, customer, amount: parseFloat(amount), method, reference, date: new Date().toISOString().split('T')[0] }
  payments.set(id, payment)
  res.json(payment)
})

// Inventory endpoints
app.get('/api/inventory/items', (req, res) => {
  const inventoryList = Array.from(inventory.values())
  res.json({ data: inventoryList })
})

app.post('/api/inventory/items', (req, res) => {
  const { name, sku, quantity, location, minStock } = req.body
  const id = Date.now().toString()
  const item = { id, name, sku, quantity: parseInt(quantity), location, minStock: parseInt(minStock) }
  inventory.set(id, item)
  res.json(item)
})

// HR endpoints
app.get('/api/hr/employees', (req, res) => {
  const employeeList = Array.from(employees.values())
  res.json({ data: employeeList })
})

app.post('/api/hr/employees', (req, res) => {
  const { name, email, position, department, salary } = req.body
  const id = Date.now().toString()
  const employee = { id, name, email, position, department, salary: parseFloat(salary) }
  employees.set(id, employee)
  res.json(employee)
})

app.get('/api/hr/attendance', (req, res) => {
  const attendanceList = Array.from(attendance.values())
  res.json({ data: attendanceList })
})

app.post('/api/hr/attendance', (req, res) => {
  const { employeeId, employeeName, date, checkIn, checkOut, status } = req.body
  const id = Date.now().toString()
  const record = { id, employeeId, employeeName, date, checkIn, checkOut, status }
  attendance.set(id, record)
  res.json(record)
})

app.get('/api/hr/leaves', (req, res) => {
  const leaveList = Array.from(leaves.values())
  res.json({ data: leaveList })
})

app.post('/api/hr/leaves', (req, res) => {
  const { employeeId, employeeName, type, startDate, endDate, reason, status } = req.body
  const id = Date.now().toString()
  const leave = { id, employeeId, employeeName, type, startDate, endDate, reason, status }
  leaves.set(id, leave)
  res.json(leave)
})

// Reports endpoints
app.get('/api/reports', (req, res) => {
  const reportList = Array.from(reports.values())
  res.json({ data: reportList })
})

app.post('/api/reports', (req, res) => {
  const { name, type, filters, schedule } = req.body
  const id = Date.now().toString()
  const report = { id, name, type, filters, schedule, createdAt: new Date().toISOString() }
  reports.set(id, report)
  res.json(report)
})

// Workflows endpoints
app.get('/api/workflows', (req, res) => {
  const workflowList = Array.from(workflows.values())
  res.json({ data: workflowList })
})

app.post('/api/workflows', (req, res) => {
  const { name, description, trigger, actions, status } = req.body
  const id = Date.now().toString()
  const workflow = { id, name, description, trigger, actions, status: status || 'Active', createdAt: new Date().toISOString() }
  workflows.set(id, workflow)
  res.json(workflow)
})

// AI endpoints
app.get('/api/ai/insights', (req, res) => {
  const insightList = Array.from(aiInsights.values())
  res.json({ data: insightList })
})

app.post('/api/ai/insights', (req, res) => {
  const { title, type, data, confidence } = req.body
  const id = Date.now().toString()
  const insight = { id, title, type, data, confidence, generatedAt: new Date().toISOString() }
  aiInsights.set(id, insight)
  res.json(insight)
})

// Website Builder endpoints
app.get('/api/websites', (req, res) => {
  const websiteList = Array.from(websites.values())
  res.json({ data: websiteList })
})

app.post('/api/websites', (req, res) => {
  const { name, domain, template, status } = req.body
  const id = Date.now().toString()
  const website = { id, name, domain, template, status: status || 'Draft', createdAt: new Date().toISOString() }
  websites.set(id, website)
  res.json(website)
})

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`API Documentation: http://localhost:${PORT}/api/health`)
})