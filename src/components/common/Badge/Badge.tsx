import { ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import { Role, SignalementStatus, AlertStatus } from '../../../api/types'

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantStyles = {
  primary: 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300',
  success: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
  warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
  danger: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
  info: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
}

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', variantStyles[variant], className)}>
      {children}
    </span>
  )
}

interface RoleBadgeProps {
  role: Role
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const variantMap: Record<Role, BadgeVariant> = {
    [Role.CITOYEN]: 'info',
    [Role.POLICIER]: 'warning',
    [Role.ADMIN_BAAWA]: 'danger',
    [Role.ADMIN_SCHOOL]: 'danger',
  }

  const labelMap: Record<Role, string> = {
    [Role.CITOYEN]: 'Citoyen',
    [Role.POLICIER]: 'Policier',
    [Role.ADMIN_BAAWA]: 'Admin',
    [Role.ADMIN_SCHOOL]: 'Admin École',
  }

  return <Badge variant={variantMap[role]}>{labelMap[role]}</Badge>
}

interface StatusBadgeProps {
  status: SignalementStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variantMap: Record<SignalementStatus, BadgeVariant> = {
    [SignalementStatus.DRAFT]: 'info',
    [SignalementStatus.PENDING]: 'warning',
    [SignalementStatus.PUBLISHED]: 'info',
    [SignalementStatus.VERIFIED]: 'success',
    [SignalementStatus.ARCHIVED]: 'info',
  }

  const labelMap: Record<SignalementStatus, string> = {
    [SignalementStatus.DRAFT]: 'Brouillon',
    [SignalementStatus.PENDING]: 'En attente',
    [SignalementStatus.PUBLISHED]: 'Publié',
    [SignalementStatus.VERIFIED]: 'Vérifié',
    [SignalementStatus.ARCHIVED]: 'Archivé',
  }

  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>
}

interface AlertStatusBadgeProps {
  status: AlertStatus
}

export function AlertStatusBadge({ status }: AlertStatusBadgeProps) {
  const variantMap: Record<AlertStatus, BadgeVariant> = {
    [AlertStatus.URGENT]: 'danger',
    [AlertStatus.INFO_RECUE]: 'success',
    [AlertStatus.STANDARD]: 'info',
    [AlertStatus.RESOLVED]: 'success',
  }

  const labelMap: Record<AlertStatus, string> = {
    [AlertStatus.URGENT]: 'Urgent',
    [AlertStatus.INFO_RECUE]: 'Info reçue',
    [AlertStatus.STANDARD]: 'Standard',
    [AlertStatus.RESOLVED]: 'Résolu',
  }

  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>
}
