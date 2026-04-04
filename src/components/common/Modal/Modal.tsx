import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../../utils/cn'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={cn('w-full mx-4 rounded-[20px] bg-white dark:bg-slate-800 shadow-xl animate-slide-in', sizeMap[size])}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
            <h2 id="modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex gap-2">{footer}</div>}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  )
}
