import { ReactNode } from 'react'
import { cn } from '../../../utils/cn'

export interface Column<T> {
  key: keyof T | string
  label: string
  render?: (value: any, item: T) => ReactNode
  sortable?: boolean
  className?: string
}

export interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  onRowClick?: (item: T) => void
  emptyMessage?: string
  className?: string
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  isLoading,
  onSort,
  onRowClick,
  emptyMessage = 'Aucune donnée disponible',
  className,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className={cn('w-full border-collapse', className)}>
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-slate-200 dark:border-slate-700">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-6 py-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
        <svg className="h-12 w-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className={cn('w-full border-collapse', className)}>
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  'px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white',
                  column.sortable && 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800',
                  column.className
                )}
                onClick={() => column.sortable && onSort?.(column.key as string, 'asc')}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && (
                    <svg className="h-4 w-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 12a1 1 0 102 0V5.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 5.414V12z" />
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={String(item.id || index)}
              className={cn(
                'border-b border-slate-200 dark:border-slate-700 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900'
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => {
                const value = (item as any)[column.key as string]
                return (
                  <td
                    key={String(column.key)}
                    className={cn('px-6 py-4 text-sm text-slate-900 dark:text-slate-100', column.className)}
                  >
                    {column.render ? column.render(value, item) : value}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
