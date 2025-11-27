import { Routes, Route, Link } from 'react-router-dom'
import { Plus, RefreshCw, AlertCircle } from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { TableSkeleton } from '../../components/Skeleton'
import { CustomerForm } from '../../components/CustomerForm'
import Pipeline from './Pipeline'
import Opportunities from './Opportunities'
import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { apiClient } from '../../api/client'
import { handleApiError } from '../../utils/errorHandler'

const Leads = memo(function Leads() {
  const [leads, setLeads] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const loadLeads = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await apiClient.get('/crm/customers')
      const data = response.data || response || []
      setLeads(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])
    } catch (err) {
      const appError = handleApiError(err)
      const error = new Error(appError.message)
      setError(error)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAddCustomer = async (customerData) => {
    try {
      await apiClient.post('/crm/customers', customerData)
      setShowForm(false)
      loadLeads()
    } catch (err) {
      console.error('Failed to add customer:', err)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [loadLeads])

  const tableData = useMemo(() => {
    return leads.map(lead => ({
      id: lead.id,
      name: lead.name || 'N/A',
      company: lead.company || 'N/A',
      email: lead.email || 'N/A',
      status: lead.status || 'New',
    }))
  }, [leads])

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Leads</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} /> <span className="hidden sm:inline">New Customer</span><span className="sm:hidden">New</span>
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
              onClick={() => loadLeads()}
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
            { key: 'id', label: 'Lead ID' },
            { key: 'name', label: 'Name' },
            { key: 'company', label: 'Company' },
            { key: 'email', label: 'Email' },
            { key: 'status', label: 'Status' },
          ]}
          data={tableData}
        />
      )}
      
      <CustomerForm 
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddCustomer}
      />
    </div>
  )
})

export default function CRM() {
  return (
    <Routes>
      <Route path="/leads" element={<Leads />} />
      <Route path="/pipeline" element={<Pipeline />} />
      <Route path="/opportunities" element={<Opportunities />} />
      <Route
        path="/"
        element={
          <div className="space-y-4 p-4 md:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">CRM</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="leads" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Leads</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage sales leads</p>
              </Link>
              <Link to="pipeline" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Pipeline</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Track deal stages</p>
              </Link>
              <Link to="opportunities" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Opportunities</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage opportunities</p>
              </Link>
            </div>
          </div>
        }
      />
    </Routes>
  )
}

