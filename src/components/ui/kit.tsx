import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'
import { initialsOf } from '../../utils/tracking'
import { inputClass } from './styles'

// Socle visuel des écrans écoles et boîtiers. Les valeurs reprennent celles
// de la fiche école, pour que tous les écrans aient la même allure.

export function PageContainer({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return <div className={cn('mx-auto flex flex-col gap-[22px]', wide ? 'max-w-[1320px]' : 'max-w-[1080px]')}>{children}</div>
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn('bg-white border border-[#e8ecf2] rounded-[20px] shadow-[0_8px_26px_-18px_rgba(16,24,40,.28)]', className)}>
      {children}
    </section>
  )
}

export function PanelHeader({ icon, title, subtitle, action }: {
  icon?: string
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className="flex items-center justify-center w-[38px] h-[38px] rounded-[11px] bg-[#eef4ff] text-[#2563eb] shrink-0">
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-[17px] font-extrabold text-[#101828]">{title}</h3>
          {subtitle && <p className="text-[13px] font-semibold text-[#98a2b3]">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

// ========== Boutons ==========

type BtnVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

const BTN_VARIANTS: Record<BtnVariant, string> = {
  primary:
    'bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-[0_10px_22px_-10px_rgba(37,99,235,.7)] hover:brightness-110',
  secondary: 'bg-white border border-[#e2e7ee] text-[#475467] hover:bg-[#f7f9fc]',
  danger: 'bg-[#d92d20] text-white shadow-[0_10px_22px_-12px_rgba(217,45,32,.7)] hover:bg-[#b42318]',
  ghost: 'text-[#475467] hover:bg-[#f2f4f7]',
}

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: 'sm' | 'md'
  icon?: string
  loading?: boolean
}

export function Btn({ variant = 'primary', size = 'md', icon, loading, children, className, disabled, type = 'button', ...rest }: BtnProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-bold transition shrink-0 disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' ? 'px-3 py-2 rounded-[10px] text-[13px]' : 'px-5 py-[12px] rounded-[13px] text-[14.5px]',
        BTN_VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {(icon || loading) && (
        <span className={cn('material-symbols-outlined', size === 'sm' ? 'text-[16px]' : 'text-[18px]', loading && 'animate-spin')}>
          {loading ? 'progress_activity' : icon}
        </span>
      )}
      {children}
    </button>
  )
}

/** Bouton réduit à une icône ; `label` sert d'infobulle et de nom accessible. */
export function IconBtn({ icon, label, tone = 'slate', className, ...rest }: {
  icon: string
  label: string
  tone?: 'slate' | 'red' | 'blue'
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const tones = {
    slate: 'text-[#667085] hover:bg-[#f2f4f7] hover:text-[#101828]',
    red: 'text-[#667085] hover:bg-[#fef3f2] hover:text-[#d92d20]',
    blue: 'text-[#667085] hover:bg-[#eef4ff] hover:text-[#2563eb]',
  }
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={cn('flex items-center justify-center w-9 h-9 rounded-[10px] transition disabled:opacity-40', tones[tone], className)}
      {...rest}
    >
      <span className="material-symbols-outlined text-[19px]">{icon}</span>
    </button>
  )
}

// ========== Formulaires ==========

export function Field({ label, hint, error, children, className }: {
  label: string
  hint?: ReactNode
  error?: string | null
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('flex flex-col gap-[7px]', className)}>
      <span className="text-[12.5px] font-bold text-[#475467]">{label}</span>
      {children}
      {error ? (
        <span className="text-[12px] font-semibold text-[#d92d20]">{error}</span>
      ) : hint ? (
        <span className="text-[12px] text-[#98a2b3]">{hint}</span>
      ) : null}
    </label>
  )
}

export function SearchInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn('relative flex-1 min-w-[220px] max-w-[420px]', className)}>
      <span className="material-symbols-outlined absolute left-[15px] top-1/2 -translate-y-1/2 text-[19px] text-[#98a2b3]">
        search
      </span>
      <input type="search" className={cn(inputClass, 'pl-11 shadow-[0_1px_2px_rgba(16,24,40,.03)]')} {...rest} />
    </div>
  )
}

/** Filtre à choix unique, présenté comme une rangée d'onglets compacts. */
export function Segmented<T extends string>({ options, value, onChange }: {
  options: { value: T; label: string; count?: number }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 p-1 rounded-[13px] bg-[#f2f4f7]" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[13px] font-bold transition',
            o.value === value ? 'bg-white text-[#101828] shadow-[0_1px_3px_rgba(16,24,40,.12)]' : 'text-[#667085] hover:text-[#101828]',
          )}
        >
          {o.label}
          {o.count !== undefined && (
            <span className={cn('px-1.5 rounded-full text-[11px]', o.value === value ? 'bg-[#eef4ff] text-[#2563eb]' : 'bg-[#e4e7ec] text-[#667085]')}>
              {o.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ========== Affichage ==========

export type Tone = 'green' | 'red' | 'amber' | 'blue' | 'slate'

const PILL_TONES: Record<Tone, { box: string; dot: string }> = {
  green: { box: 'bg-[#ecfdf3] text-[#067647]', dot: 'bg-[#12b76a]' },
  red: { box: 'bg-[#fef3f2] text-[#b42318]', dot: 'bg-[#f04438]' },
  amber: { box: 'bg-[#fffaeb] text-[#b54708]', dot: 'bg-[#f79009]' },
  blue: { box: 'bg-[#eef4ff] text-[#1d4ed8]', dot: 'bg-[#2563eb]' },
  slate: { box: 'bg-[#f2f4f7] text-[#475467]', dot: 'bg-[#98a2b3]' },
}

export function Pill({ tone = 'slate', dot, icon, children, className, title }: {
  tone?: Tone
  dot?: boolean
  icon?: string
  children: ReactNode
  className?: string
  title?: string
}) {
  return (
    <span title={title} className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap', PILL_TONES[tone].box, className)}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', PILL_TONES[tone].dot)} />}
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      {children}
    </span>
  )
}

const AVATAR_PALETTE = [
  { bg: '#eaf1ff', fg: '#1d4ed8' },
  { bg: '#e7f8f0', fg: '#087443' },
  { bg: '#f3edff', fg: '#6d28d9' },
  { bg: '#fff1e6', fg: '#c2410c' },
]

/** Pastille d'initiales ; la couleur dépend du nom, donc reste stable d'un écran à l'autre. */
export function Avatar({ name, size = 42 }: { name: string; size?: number }) {
  const hash = [...name].reduce((sum, c) => sum + c.charCodeAt(0), 0)
  const palette = AVATAR_PALETTE[hash % AVATAR_PALETTE.length]
  return (
    <div
      className="flex items-center justify-center font-extrabold shrink-0"
      style={{ width: size, height: size, borderRadius: size * 0.29, fontSize: size * 0.34, background: palette.bg, color: palette.fg }}
      aria-hidden
    >
      {initialsOf(name)}
    </div>
  )
}

export function StatCard({ icon, label, value, tone = 'blue', hint }: {
  icon: string
  label: string
  value: ReactNode
  tone?: Tone
  hint?: string
}) {
  return (
    <div className="flex items-center gap-3 bg-white border border-[#e8ecf2] rounded-2xl px-4 py-[14px]" title={hint}>
      <div className={cn('flex items-center justify-center w-[42px] h-[42px] rounded-xl shrink-0', PILL_TONES[tone].box)}>
        <span className="material-symbols-outlined text-[21px]">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[22px] leading-none font-extrabold text-[#101828]">{value}</p>
        <p className="text-[12.5px] font-semibold text-[#98a2b3] mt-1.5 truncate">{label}</p>
      </div>
    </div>
  )
}

export function EmptyState({ icon, title, text, action }: {
  icon: string
  title: string
  text?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center text-center py-12 px-5">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f2f4f7] text-[#98a2b3] mb-4">
        <span className="material-symbols-outlined text-[28px]">{icon}</span>
      </div>
      <p className="font-extrabold text-[#101828]">{title}</p>
      {text && <p className="text-[13.5px] text-[#667085] mt-1.5 max-w-[420px]">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Loading({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-[#98a2b3] font-semibold text-sm">
      <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
      {label}
    </div>
  )
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#fecdca] bg-[#fef3f2] px-4 py-3 text-[13.5px] font-semibold text-[#b42318]">
      <span className="material-symbols-outlined text-[18px]">error</span>
      {children}
    </div>
  )
}

// ========== Fenêtres ==========

export function Dialog({ open, onClose, title, subtitle, icon, children, footer, size = 'md' }: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: ReactNode
  icon?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  const width = { sm: 'max-w-[420px]', md: 'max-w-[560px]', lg: 'max-w-[720px]' }[size]

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#101828]/55 backdrop-blur-[2px]"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={cn('w-full bg-white rounded-t-[22px] sm:rounded-[22px] shadow-2xl flex flex-col max-h-[92vh]', width)}>
        <div className="flex items-start gap-3 px-6 pt-6 pb-4">
          {icon && (
            <div className="flex items-center justify-center w-[38px] h-[38px] rounded-[11px] bg-[#eef4ff] text-[#2563eb] shrink-0">
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-[17px] font-extrabold text-[#101828]">{title}</h2>
            {subtitle && <p className="text-[13px] font-semibold text-[#98a2b3] mt-0.5">{subtitle}</p>}
          </div>
          <IconBtn icon="close" label="Fermer" onClick={onClose} className="-mr-2 -mt-1" />
        </div>
        <div className="px-6 pb-6 overflow-y-auto">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 px-6 py-4 border-t border-[#eef1f5] bg-[#fafbfc] rounded-b-[22px]">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmer', danger, loading }: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: ReactNode
  confirmLabel?: string
  danger?: boolean
  loading?: boolean
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={loading}>Annuler</Btn>
          <Btn variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>{confirmLabel}</Btn>
        </>
      }
    >
      <div className="text-[14px] leading-relaxed text-[#475467]">{message}</div>
    </Dialog>
  )
}

/** Identifiants d'un compte tout juste créé : le mot de passe n'est affiché qu'une fois. */
export function CredentialsNotice({ email, tempPassword }: { email: string; tempPassword: string }) {
  return (
    <div className="rounded-2xl border border-[#fed7aa] bg-gradient-to-b from-[#fffbf5] to-[#fff7ed] p-5">
      <p className="flex items-center gap-2 font-extrabold text-[#9a3412]">
        <span className="material-symbols-outlined text-[#c2410c] text-[18px]">warning</span>
        Compte créé — notez ces identifiants
      </p>
      <p className="text-[12.5px] font-semibold text-[#b45309] mt-2">
        Ce mot de passe temporaire ne sera plus affiché. Communiquez-le à l'utilisateur ; il devra le changer à sa première connexion.
      </p>
      <div className="flex flex-col gap-2 mt-3">
        <div className="flex items-center justify-between gap-3 bg-white border border-[#fed7aa] rounded-[10px] px-3 py-2 text-sm">
          <span className="text-[#b45309]">Identifiant</span>
          <code className="font-mono text-[#101828] truncate">{email}</code>
        </div>
        <div className="flex items-center justify-between gap-3 bg-white border border-[#fed7aa] rounded-[10px] px-3 py-2 text-sm">
          <span className="text-[#b45309]">Mot de passe temporaire</span>
          <code className="font-mono font-bold text-[#101828]">{tempPassword}</code>
        </div>
      </div>
      <CopyButton text={tempPassword} />
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(text)
        setCopied(true)
      }}
      className="mt-3 px-4 py-2 rounded-lg bg-[#ea580c] text-white text-xs font-bold hover:bg-[#c2410c]"
    >
      {copied ? 'Copié ✓' : 'Copier le mot de passe'}
    </button>
  )
}
