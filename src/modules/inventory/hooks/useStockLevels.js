/**
 * Custom Hook for Inventory Stock Levels
 */

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../../../infrastructure/api'
import { handleApiError } from '../../../utils/errorHandler'

export function useStockLevels() {
  const [stock, setStock] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadStock = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await apiClient.get('/inventory/stock')
      setStock(response.data || [])
    } catch (err) {
      const appError = handleApiError(err)
      setError(new Error(appError.message))
      setStock([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStock()
  }, [loadStock])

  return {
    stock,
    error,
    loading,
    refetch: loadStock,
  }
}

