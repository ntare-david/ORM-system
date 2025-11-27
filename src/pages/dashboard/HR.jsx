import { Routes, Route, Link } from 'react-router-dom'
import { Plus, RefreshCw, AlertCircle } from 'lucide-react'
import { DataTable } from '../../components/DataTable'
import { TableSkeleton } from '../../components/Skeleton'
import { EmployeeForm } from '../../components/EmployeeForm'
import Attendance from './Attendance'
import Leaves from './Leaves'
import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { apiClient } from '../../api/client'
import { handleApiError } from '../../utils/errorHandler'

const Employees = memo(function Employees() {
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const loadEmployees = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await apiClient.get('/hr/employees')
      const data = response.data || response || []
      setEmployees(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [])
    } catch (err) {
      const appError = handleApiError(err)
      const error = new Error(appError.message)
      setError(error)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAddEmployee = async (employeeData) => {
    try {
      await apiClient.post('/hr/employees', employeeData)
      setShowForm(false)
      loadEmployees()
    } catch (err) {
      console.error('Failed to add employee:', err)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  const tableData = useMemo(() => {
    return employees.map(emp => ({
      id: emp.id,
      name: emp.name || 'N/A',
      department: emp.department || 'N/A',
      position: emp.position || 'N/A',
      status: emp.status || 'Active',
    }))
  }, [employees])

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Employees</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={18} /> <span className="hidden sm:inline">New Employee</span><span className="sm:hidden">New</span>
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
              onClick={() => loadEmployees()}
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
            { key: 'id', label: 'Employee ID' },
            { key: 'name', label: 'Name' },
            { key: 'department', label: 'Department' },
            { key: 'position', label: 'Position' },
            { key: 'status', label: 'Status' },
          ]}
          data={tableData}
        />
      )}
      
      <EmployeeForm 
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddEmployee}
      />
    </div>
  )
})

export default function HR() {
  return (
    <Routes>
      <Route path="/employees" element={<Employees />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/leaves" element={<Leaves />} />
      <Route
        path="/"
        element={
          <div className="space-y-4 p-4 md:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">HR Management</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="employees" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Employees</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage employee records</p>
              </Link>
              <Link to="attendance" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Attendance</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Track attendance</p>
              </Link>
              <Link to="leaves" className="card hover:shadow-md transition-shadow">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Leaves</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage leave requests</p>
              </Link>
            </div>
          </div>
        }
      />
    </Routes>
  )
}

