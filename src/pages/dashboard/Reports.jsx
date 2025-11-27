import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { Plus, RefreshCw, AlertCircle } from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { TableSkeleton } from '../../components/Skeleton'
import { ReportForm } from '../../components/ReportForm'
import { apiClient } from '../../api/client'
import { handleApiError } from '../../utils/errorHandler'

export default function Reports() {
  const [reports, setReports] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const loadReports = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await apiClient.get('/reports')
      const data = response.data || response || []
      setReports(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])
    } catch (err) {
      const appError = handleApiError(err)
      const error = new Error(appError.message)
      setError(error)
      setReports([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAddReport = async (reportData) => {
    try {
      await apiClient.post('/reports', reportData)
      setShowForm(false)
      loadReports()
    } catch (err) {
      console.error('Failed to add report:', err)
    }
  }

  useEffect(() => {
    loadReports()
  }, [loadReports])

  const tableData = useMemo(() => {
    return reports.map(report => ({
      id: report.id,
      name: report.name || 'N/A',
      type: report.type || 'N/A',
      schedule: report.schedule || 'Manual',
      created: report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A',
    }))
  }, [reports])

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} /> <span className="hidden sm:inline">New Report</span><span className="sm:hidden">New</span>
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
              onClick={() => loadReports()}
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
            { key: 'id', label: 'Report ID' },
            { key: 'name', label: 'Name' },
            { key: 'type', label: 'Type' },
            { key: 'schedule', label: 'Schedule' },
            { key: 'created', label: 'Created' },
          ]}
          data={tableData}
        />
      )}
      
      <ReportForm 
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddReport}
      />
    </div>
  )
}

