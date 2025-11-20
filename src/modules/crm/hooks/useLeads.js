/**
 * Custom Hook for CRM Leads
 */

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../../../infrastructure/api'
import { handleApiError } from '../../../utils/errorHandler'

export function useLeads() {
  const [leads, setLeads] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadLeads = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await apiClient.get('/crm/leads')
      setLeads(response.data || [])
    } catch (err) {
      const appError = handleApiError(err)
      setError(new Error(appError.message))
      setLeads([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLeads()
  }, [loadLeads])

  return {
    leads,
    error,
    loading,
    refetch: loadLeads,
  }
}

