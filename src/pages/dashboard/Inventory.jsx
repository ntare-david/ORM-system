import { Routes, Route, Link } from 'react-router-dom'
import { Plus, RefreshCw, AlertCircle } from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { TableSkeleton } from '../../components/Skeleton'
import { InventoryForm } from '../../components/InventoryForm'
import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { apiClient } from '../../api/client'
import { handleApiError } from '../../utils/errorHandler'
import StockMoves from './Movements'
import StockPicking from './Picking'

const Items = memo(function Items() {
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const loadItems = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await apiClient.get('/inventory/items')
      const data = response.data || response || []
      setItems(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])
    } catch (err) {
      const appError = handleApiError(err)
      const error = new Error(appError.message)
      setError(error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAddItem = async (itemData) => {
    try {
      await apiClient.post('/inventory/items', itemData)
      setShowForm(false)
      loadItems()
    } catch (err) {
      console.error('Failed to add item:', err)
    }
  }

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const tableData = useMemo(() => {
    return items.map(item => ({
      id: item.id,
      name: item.name || 'N/A',
      sku: item.sku || 'N/A',
      quantity: item.quantity || 0,
      location: item.location || 'N/A',
      minStock: item.minStock || 0,
    }))
  }, [items])

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Inventory Items</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} /> <span className="hidden sm:inline">New Item</span><span className="sm:hidden">New</span>
        </button>
      </div>
      
      {loading ? (
        <div className="card">
          <TableSkeleton rows={5} columns={6} />
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
              onClick={() => loadItems()}
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
            { key: 'id', label: 'Item ID' },
            { key: 'name', label: 'Name' },
            { key: 'sku', label: 'SKU' },
            { key: 'quantity', label: 'Quantity' },
            { key: 'location', label: 'Location' },
            { key: 'minStock', label: 'Min Stock' },
          ]}
          data={tableData}
        />
      )}
      
      <InventoryForm 
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddItem}
      />
    </div>
  )
})

export default function Inventory() {
  return (
    <Routes>
      <Route path="/items" element={<Items />} />
      <Route path="/moves" element={<StockMoves />} />
      <Route path="/picking" element={<StockPicking />} />
      <Route
        path="/"
        element={
          <div className="space-y-4 p-4 md:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Inventory</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="items" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Items</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage inventory items</p>
              </Link>
              <Link to="moves" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Stock Moves</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Track movements</p>
              </Link>
              <Link to="picking" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Picking</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage pick operations</p>
              </Link>
            </div>
          </div>
        }
      />
    </Routes>
  )
}

