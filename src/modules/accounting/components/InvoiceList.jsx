/**
 * Invoice List Component (Presentational)
 * Dumb component that displays invoices
 */

import { DataTable } from '../../../components/DataTable'
import { TableSkeleton } from '../../../components/Skeleton'
import { AlertCircle, RefreshCw } from 'lucide-react'

export function InvoiceList({ invoices, loading, error, onRetry, onInvoiceClick }) {
  if (loading) {
    return (
      <div className="card">
        <TableSkeleton rows={5} columns={5} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Error</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6 max-w-md">
            {error.message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={18} />
              Retry
            </button>
          )}
        </div>
      </div>
    )
  }

  const tableData = invoices.map(inv => ({
    id: inv.id,
    customer: inv.customer,
    amount: `$${inv.amount?.toLocaleString() || '0'}`,
    status: inv.status,
    date: inv.date ? new Date(inv.date).toLocaleDateString() : 'N/A',
  }))

  return (
    <DataTable
      columns={[
        { key: 'id', label: 'Invoice ID' },
        { key: 'customer', label: 'Customer' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status' },
        { key: 'date', label: 'Date' },
      ]}
      data={tableData}
      onRowClick={onInvoiceClick}
    />
  )
}

