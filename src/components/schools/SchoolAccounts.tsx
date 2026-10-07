import { useState } from 'react'
import { CreateSchoolUserDto, SchoolUser } from '../../api/types'
import { useAuthStore } from '../../store/authStore'
import {
  Avatar, Btn, ConfirmDialog, CredentialsNotice, Dialog, EmptyState, Field, Loading, Panel, PanelHeader, Pill,
} from '../ui/kit'
import { inputClass } from '../ui/styles'

const EMPTY: CreateSchoolUserDto = { email: '', firstName: '', lastName: '', phoneNumber: '' }

interface Props {
  users?: SchoolUser[]
  isLoading: boolean
  /** Crée le compte et renvoie ses identifiants (mot de passe temporaire inclus) */
  onCreate: (data: CreateSchoolUserDto) => Promise<{ email: string; tempPassword?: string }>
  creating: boolean
  onToggle: (userId: string) => Promise<unknown>
  toggling: boolean
}

/**
 * Comptes d'accès d'une école : liste, création, activation. Partagé entre
 * l'admin BAAWA (fiche d'une école) et l'école elle-même (ses utilisateurs).
 */
export function SchoolAccounts({ users, isLoading, onCreate, creating, onToggle, toggling }: Props) {
  const me = useAuthStore((s) => s.user)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [created, setCreated] = useState<{ email: string; tempPassword: string } | null>(null)
  const [toggle, setToggle] = useState<SchoolUser | null>(null)
  const set = (patch: Partial<CreateSchoolUserDto>) => setForm((f) => ({ ...f, ...patch }))

  const closeForm = () => {
    setShowForm(false)
    setForm(EMPTY)
    setCreated(null)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await onCreate(form)
      setForm(EMPTY)
      if (data?.tempPassword) setCreated({ email: data.email, tempPassword: data.tempPassword })
      else closeForm()
    } catch {
      // l'erreur est déjà affichée par le hook appelant
    }
  }

  return (
    <Panel className="p-7">
      <PanelHeader
        icon="manage_accounts"
        title="Comptes d'accès"
        subtitle="Les personnes qui peuvent se connecter au nom de l'école"
        action={<Btn size="sm" icon="person_add" onClick={() => setShowForm(true)}>Nouveau compte</Btn>}
      />

      {isLoading ? (
        <Loading />
      ) : !users?.length ? (
        <EmptyState
          icon="no_accounts"
          title="Aucun compte pour cette école"
          text="Sans compte, personne ne peut gérer les élèves ni suivre la carte."
          action={<Btn icon="person_add" onClick={() => setShowForm(true)}>Créer le premier compte</Btn>}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center gap-3 bg-[#f9fafc] border border-[#eef1f5] rounded-[13px] px-[14px] py-3">
              <Avatar name={`${u.firstName} ${u.lastName}`} />
              <div className="flex-1 min-w-[180px]">
                <p className="font-bold text-[14.5px] text-[#101828] truncate">
                  {u.firstName} {u.lastName}
                  {u.id === me?.id && <span className="text-[#98a2b3] font-semibold"> (vous)</span>}
                </p>
                <p className="text-[12.5px] text-[#98a2b3] truncate">{u.email} · {u.phoneNumber}</p>
              </div>
              <Pill tone={u.isActive ? 'green' : 'slate'} dot>{u.isActive ? 'Actif' : 'Désactivé'}</Pill>
              {/* Se désactiver soi-même couperait son propre accès */}
              {u.id !== me?.id && (
                <Btn size="sm" variant="secondary" onClick={() => setToggle(u)}>
                  {u.isActive ? 'Désactiver' : 'Réactiver'}
                </Btn>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={showForm}
        onClose={closeForm}
        icon="person_add"
        title="Nouveau compte"
        subtitle="Un mot de passe temporaire est généré et envoyé par email."
        footer={
          created ? (
            <Btn onClick={closeForm}>J'ai noté les identifiants</Btn>
          ) : (
            <>
              <Btn variant="secondary" onClick={closeForm} disabled={creating}>Annuler</Btn>
              <Btn type="submit" form="account-form" loading={creating}>Créer le compte</Btn>
            </>
          )
        }
      >
        {created ? (
          <CredentialsNotice email={created.email} tempPassword={created.tempPassword} />
        ) : (
          <form id="account-form" onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Prénom *">
              <input required autoFocus value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} placeholder="Ex. Fatou" className={inputClass} />
            </Field>
            <Field label="Nom *">
              <input required value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} placeholder="Ex. DIALLO" className={inputClass} />
            </Field>
            <Field label="Email *">
              <input required type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} placeholder="admin@ecole.sn" className={inputClass} />
            </Field>
            <Field label="Téléphone *">
              <input required type="tel" value={form.phoneNumber} onChange={(e) => set({ phoneNumber: e.target.value })} placeholder="77 000 00 00" className={inputClass} />
            </Field>
          </form>
        )}
      </Dialog>

      <ConfirmDialog
        open={!!toggle}
        onClose={() => setToggle(null)}
        onConfirm={() => toggle && onToggle(toggle.id).then(() => setToggle(null)).catch(() => undefined)}
        loading={toggling}
        danger={toggle?.isActive}
        title={toggle?.isActive ? 'Désactiver ce compte ?' : 'Réactiver ce compte ?'}
        confirmLabel={toggle?.isActive ? 'Désactiver' : 'Réactiver'}
        message={
          toggle?.isActive ? (
            <><strong className="text-[#101828]">{toggle.firstName} {toggle.lastName}</strong> ne pourra plus se connecter ni recevoir les alertes des boîtiers.</>
          ) : (
            <><strong className="text-[#101828]">{toggle?.firstName} {toggle?.lastName}</strong> pourra de nouveau se connecter.</>
          )
        }
      />
    </Panel>
  )
}
