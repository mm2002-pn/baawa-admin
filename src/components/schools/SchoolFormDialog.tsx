import { useState } from 'react'
import { School } from '../../api/types'
import { useCreateSchool, useUpdateSchool } from '../../hooks/useSchools'
import { Btn, Dialog, Field } from '../ui/kit'
import { inputClass } from '../ui/styles'

const REGIONS = [
  'Dakar', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kédougou', 'Kolda', 'Louga',
  'Matam', 'Saint-Louis', 'Sédhiou', 'Tambacounda', 'Thiès', 'Ziguinchor',
]

/** Création d'une école, ou modification de `school`. Monté uniquement quand il est ouvert. */
export function SchoolFormDialog({ school, onClose }: { school?: School | null; onClose: () => void }) {
  const createSchool = useCreateSchool()
  const updateSchool = useUpdateSchool(school?.id ?? '')
  const [form, setForm] = useState({
    name: school?.name ?? '',
    region: school?.region ?? '',
    address: school?.address ?? '',
    phoneNumber: school?.phoneNumber ?? '',
    email: school?.email ?? '',
  })
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))
  const pending = createSchool.isPending || updateSchool.isPending

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // L'email est unique et validé côté serveur : vide, il ne doit pas être envoyé
    const data = {
      name: form.name.trim(),
      region: form.region || undefined,
      address: form.address.trim() || undefined,
      phoneNumber: form.phoneNumber.trim() || undefined,
      email: form.email.trim() || undefined,
    }
    if (school) updateSchool.mutate(data, { onSuccess: onClose })
    else createSchool.mutate(data, { onSuccess: onClose })
  }

  return (
    <Dialog
      open
      onClose={onClose}
      icon="school"
      title={school ? "Modifier l'école" : 'Nouvelle école'}
      size="lg"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={pending}>Annuler</Btn>
          <Btn type="submit" form="school-form" loading={pending}>{school ? 'Enregistrer' : "Créer l'école"}</Btn>
        </>
      }
    >
      <form id="school-form" onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nom de l'école *" className="sm:col-span-2">
          <input required autoFocus value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Ex. École Les Pédagogues" className={inputClass} />
        </Field>
        <Field label="Région">
          <select value={form.region} onChange={(e) => set({ region: e.target.value })} className={inputClass}>
            <option value="">Non précisée</option>
            {/* Une région saisie librement avant cette liste reste sélectionnable */}
            {form.region && !REGIONS.includes(form.region) && <option value={form.region}>{form.region}</option>}
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Téléphone">
          <input type="tel" value={form.phoneNumber} onChange={(e) => set({ phoneNumber: e.target.value })} placeholder="33 800 00 00" className={inputClass} />
        </Field>
        <Field label="Adresse" className="sm:col-span-2">
          <input value={form.address} onChange={(e) => set({ address: e.target.value })} placeholder="Ex. Sicap Liberté 6, Dakar" className={inputClass} />
        </Field>
        <Field label="Email de contact" className="sm:col-span-2">
          <input type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} placeholder="contact@ecole.sn" className={inputClass} />
        </Field>
      </form>
    </Dialog>
  )
}
