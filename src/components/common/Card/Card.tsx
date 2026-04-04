import { ReactNode } from 'react'
import { cn } from '../../../utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[20px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  )
}

export function GlassCard({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'glass rounded-[20px] p-6 shadow-lg',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn('px-6 py-4 border-b border-slate-200 dark:border-slate-700', className)}>{children}</div>
}

export function CardTitle({ children, className }: CardTitleProps) {
  return <h2 className={cn('text-xl font-semibold text-slate-900 dark:text-white', className)}>{children}</h2>
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={cn('px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex gap-2', className)}>{children}</div>
}
