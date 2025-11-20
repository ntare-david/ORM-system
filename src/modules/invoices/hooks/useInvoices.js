/**
 * Custom Hook for Invoices
 * Uses the InvoiceService use case
 */

import { useState, useEffect, useCallback } from 'react'
import { serviceContainer } from '@infrastructure/ServiceContainer'

export function useInvoices() {
  const [invoices, setInvoices] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const invoiceService = serviceContainer.getInvoiceService()

  const loadInvoices = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const invoiceEntities = await invoiceService.getInvoices()
      setInvoices(invoiceEntities)
    } catch (err) {
      setError(err)
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }, [invoiceService])

  useEffect(() => {
    loadInvoices()
  }, [loadInvoices])

  const createInvoice = useCallback(async (invoiceData) => {
    try {
      const newInvoice = await invoiceService.createInvoice(invoiceData)
      await loadInvoices() // Refresh list
      return newInvoice
    } catch (err) {
      setError(err)
      throw err
    }
  }, [invoiceService, loadInvoices])

  const markAsPaid = useCallback(async (id) => {
    try {
      await invoiceService.markAsPaid(id)
      await loadInvoices() // Refresh list
    } catch (err) {
      setError(err)
      throw err
    }
  }, [invoiceService, loadInvoices])

  return {
    invoices,
    error,
    loading,
    refetch: loadInvoices,
    createInvoice,
    markAsPaid,
  }
}

