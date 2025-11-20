/**
 * Accounting Context
 * Domain-specific context for accounting state
 */

import { createContext, useContext, useState, useCallback } from 'react'

const AccountingContext = createContext(undefined)

export function AccountingProvider({ children }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const selectInvoice = useCallback((invoice) => {
    setSelectedInvoice(invoice)
  }, [])

  const value = {
    selectedInvoice,
    selectInvoice,
  }

  return (
    <AccountingContext.Provider value={value}>
      {children}
    </AccountingContext.Provider>
  )
}

export function useAccounting() {
  const context = useContext(AccountingContext)
  if (!context) {
    throw new Error('useAccounting must be used within AccountingProvider')
  }
  return context
}

