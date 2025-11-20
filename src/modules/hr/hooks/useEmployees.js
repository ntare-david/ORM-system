/**
 * Custom Hook for HR Employees
 */

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../../../infrastructure/api'
import { handleApiError } from '../../../utils/errorHandler'

export function useEmployees() {
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadEmployees = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await apiClient.get('/hr/employees')
      setEmployees(response.data || [])
    } catch (err) {
      const appError = handleApiError(err)
      setError(new Error(appError.message))
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  return {
    employees,
    error,
    loading,
    refetch: loadEmployees,
  }
}

