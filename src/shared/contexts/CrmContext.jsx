/**
 * CRM Context
 * Domain-specific context for CRM state
 */

import { createContext, useContext, useState, useCallback } from 'react'

const CrmContext = createContext(undefined)

export function CrmProvider({ children }) {
  const [selectedLead, setSelectedLead] = useState(null)

  const selectLead = useCallback((lead) => {
    setSelectedLead(lead)
  }, [])

  const value = {
    selectedLead,
    selectLead,
  }

  return (
    <CrmContext.Provider value={value}>
      {children}
    </CrmContext.Provider>
  )
}

export function useCrm() {
  const context = useContext(CrmContext)
  if (!context) {
    throw new Error('useCrm must be used within CrmProvider')
  }
  return context
}

