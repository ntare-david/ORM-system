import { Routes, Route, Link } from 'react-router-dom'
import { Plus, RefreshCw, AlertCircle } from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { TableSkeleton } from '../../components/Skeleton'
import { ProductForm } from '../../components/ProductForm'
import { OrderForm } from '../../components/OrderForm'
import Pricelists from './Pricelists'
import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { salesApi } from '../../api/sales'
import { handleApiError } from '../../utils/errorHandler'

const Products = memo(function Products() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const loadProducts = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await salesApi.getProducts()
      const data = response.data || response || []
      setProducts(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])
    } catch (err) {
      const appError = handleApiError(err)
      const error = new Error(appError.message)
      setError(error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAddProduct = async (productData) => {
    try {
      if (editingProduct) {
        await salesApi.updateProduct(editingProduct.id, productData)
      } else {
        await salesApi.createProduct(productData)
      }
      setShowForm(false)
      setEditingProduct(null)
      loadProducts()
    } catch (err) {
      console.error('Failed to save product:', err)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDeleteProduct = async (product) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await salesApi.deleteProduct(product.id)
        loadProducts()
      } catch (err) {
        console.error('Failed to delete product:', err)
      }
    }
  }

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const tableData = useMemo(() => {
    return products.map(prod => ({
      id: prod.id,
      name: prod.name,
      category: prod.category || 'N/A',
      price: `${prod.price?.toLocaleString() || '0'} RWF`,
      stock: prod.stock || 0,
    }))
  }, [products])

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Products</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} /> <span className="hidden sm:inline">New Product</span><span className="sm:hidden">New</span>
        </button>
      </div>
      
      {loading ? (
        <div className="card">
          <TableSkeleton rows={5} columns={5} />
        </div>
      ) : error ? (
        <div className="card">
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Network Error</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6 max-w-md">
              {error.message}
            </p>
            <button
              onClick={() => loadProducts()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={18} />
              Retry
            </button>
          </div>
        </div>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'Product ID' },
            { key: 'name', label: 'Name' },
            { key: 'category', label: 'Category' },
            { key: 'price', label: 'Price' },
            { key: 'stock', label: 'Stock' },
          ]}
          data={tableData}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}
      
      <ProductForm 
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingProduct(null)
        }}
        onSubmit={handleAddProduct}
        editData={editingProduct}
      />
    </div>
  )
})

const Orders = memo(function Orders() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const loadOrders = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await salesApi.getOrders()
      const data = response.data || response || []
      setOrders(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])
    } catch (err) {
      const appError = handleApiError(err)
      const error = new Error(appError.message)
      setError(error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAddOrder = async (orderData) => {
    try {
      await salesApi.createOrder(orderData)
      setShowForm(false)
      loadOrders() // Refresh the list
    } catch (err) {
      console.error('Failed to add order:', err)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const tableData = useMemo(() => {
    return orders.map(order => ({
      id: order.id,
      customer: order.customer || 'N/A',
      total: `${order.total?.toLocaleString() || '0'} RWF`,
      status: order.status || 'Pending',
      date: order.date ? new Date(order.date).toLocaleDateString() : 'N/A',
    }))
  }, [orders])

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Sales Orders</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} /> <span className="hidden sm:inline">New Order</span><span className="sm:hidden">New</span>
        </button>
      </div>
      
      {loading ? (
        <div className="card">
          <TableSkeleton rows={5} columns={5} />
        </div>
      ) : error ? (
        <div className="card">
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Network Error</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6 max-w-md">
              {error.message}
            </p>
            <button
              onClick={() => loadOrders()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={18} />
              Retry
            </button>
          </div>
        </div>
      ) : (
        <DataTable
          columns={[
            { key: 'id', label: 'Order ID' },
            { key: 'customer', label: 'Customer' },
            { key: 'total', label: 'Total' },
            { key: 'status', label: 'Status' },
            { key: 'date', label: 'Date' },
          ]}
          data={tableData}
        />
      )}
      
      <OrderForm 
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddOrder}
      />
    </div>
  )
})

export default function Sales() {
  return (
    <Routes>
      <Route path="/products" element={<Products />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/pricelists" element={<Pricelists />} />
      <Route
        path="/"
        element={
          <div className="space-y-4 p-4 md:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Sales</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="products" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Products</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage your products</p>
              </Link>
              <Link to="pricelists" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Pricelists</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Set pricing rules</p>
              </Link>
              <Link to="orders" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Orders</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Track sales orders</p>
              </Link>
            </div>
          </div>
        }
      />
    </Routes>
  )
}

