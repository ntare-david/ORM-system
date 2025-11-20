/**
 * Inventory Context
 * Domain-specific context for inventory state
 */

import { createContext, useContext, useState, useCallback } from 'react'

const InventoryContext = createContext(undefined)

export function InventoryProvider({ children }) {
  const [selectedItem, setSelectedItem] = useState(null)

  const selectItem = useCallback((item) => {
    setSelectedItem(item)
  }, [])

  const value = {
    selectedItem,
    selectItem,
  }

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider')
  }
  return context
}

