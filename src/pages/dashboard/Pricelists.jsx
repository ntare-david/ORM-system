import { Plus, RefreshCw, AlertCircle } from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { TableSkeleton } from '../../components/Skeleton'
import { PricelistForm } from '../../components/PricelistForm'
import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { salesApi } from '../../api/sales'
import { handleApiError } from '../../utils/errorHandler'

const Pricelists = memo(function Pricelists() {
  const [pricelists, setPricelists] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const loadPricelists = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await salesApi.getPricelists()
      const data = response.data || response || []
      setPricelists(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])
    } catch (err) {
      const appError = handleApiError(err)
      const error = new Error(appError.message)
      setError(error)
      setPricelists([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAddPricelist = async (pricelistData) => {
    try {
      await salesApi.createPricelist(pricelistData)
      setShowForm(false)
      loadPricelists()
    } catch (err) {
      console.error('Failed to add pricelist:', err)
    }
  }

  useEffect(() => {
    loadPricelists()
  }, [loadPricelists])

  const tableData = useMemo(() => {
    return pricelists.map(list => ({
      id: list.id,
      name: list.name || 'N/A',
      description: list.description || 'N/A',
      status: list.status || 'Active',
      items: list.items_count || 0,
    }))
  }, [pricelists])

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Pricelists</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} /> <span className="hidden sm:inline">New Pricelist</span><span className="sm:hidden">New</span>
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
              onClick={() => loadPricelists()}
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
            { key: 'id', label: 'Pricelist ID' },
            { key: 'name', label: 'Name' },
            { key: 'description', label: 'Description' },
            { key: 'status', label: 'Status' },
            { key: 'items', label: 'Items' },
          ]}
          data={tableData}
        />
      )}
      
      <PricelistForm 
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddPricelist}
      />
    </div>
  )
})

export default Pricelists

