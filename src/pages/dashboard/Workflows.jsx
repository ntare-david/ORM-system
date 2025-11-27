import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { Plus, RefreshCw, AlertCircle } from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { TableSkeleton } from '../../components/Skeleton'
import { WorkflowForm } from '../../components/WorkflowForm'
import { apiClient } from '../../api/client'
import { handleApiError } from '../../utils/errorHandler'

export default function Workflows() {
  const [workflows, setWorkflows] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const loadWorkflows = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await apiClient.get('/workflows')
      const data = response.data || response || []
      setWorkflows(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])
    } catch (err) {
      const appError = handleApiError(err)
      const error = new Error(appError.message)
      setError(error)
      setWorkflows([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAddWorkflow = async (workflowData) => {
    try {
      await apiClient.post('/workflows', workflowData)
      setShowForm(false)
      loadWorkflows()
    } catch (err) {
      console.error('Failed to add workflow:', err)
    }
  }

  useEffect(() => {
    loadWorkflows()
  }, [loadWorkflows])

  const tableData = useMemo(() => {
    return workflows.map(workflow => ({
      id: workflow.id,
      name: workflow.name || 'N/A',
      trigger: workflow.trigger || 'Manual',
      status: workflow.status || 'Active',
      created: workflow.createdAt ? new Date(workflow.createdAt).toLocaleDateString() : 'N/A',
    }))
  }, [workflows])

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Workflows</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} /> <span className="hidden sm:inline">New Workflow</span><span className="sm:hidden">New</span>
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
              onClick={() => loadWorkflows()}
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
            { key: 'id', label: 'Workflow ID' },
            { key: 'name', label: 'Name' },
            { key: 'trigger', label: 'Trigger' },
            { key: 'status', label: 'Status' },
            { key: 'created', label: 'Created' },
          ]}
          data={tableData}
        />
      )}
      
      <WorkflowForm 
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddWorkflow}
      />
    </div>
  )
}

