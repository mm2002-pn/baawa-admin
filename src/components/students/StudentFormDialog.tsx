import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gender, Student, SchoolTracker } from '../../api/types'
import { useCreateStudent, useUpdateStudent } from '../../hooks/useStudents'
import { trackerName } from '../../utils/tracking'
import { Btn, Dialog, Field } from '../ui/kit'
import { inputClass } from '../ui/styles'

const GENDER_LABELS: Record<Gender, string> = {
  [Gender.FEMININ]: 'Fille',
  [Gender.MASCULIN]: 'Garçon',
  [Gender.AUTRE]: 'Autre',
}

interface Props {
  /** Élève à modifier ; absent pour une création */
  student?: Student | null
  trackers: SchoolTracker[]
  onClose: () => void
}

/** Monté uniquement quand il est ouvert : son état repart donc de l'élève fourni. */
export function StudentFormDialog({ student, trackers, onClose }: Props) {
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()
  const [form, setForm] = useState({
    firstName: student?.firstName ?? '',
    lastName: student?.lastName ?? '',
    className: student?.className ?? '',
    gender: (student?.gender ?? '') as Gender | '',
    birthDate: student?.birthDate?.slice(0, 10) ?? '',
    parentName: student?.parentName ?? '',
    parentPhone: student?.parentPhone ?? '',
    trackerId: student?.tracker?.id ?? '',
  })
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

  // Boîtiers proposables : ceux qui sont libres et en service, plus celui que l'élève porte déjà
  const choices = trackers.filter(
    (t) => t.id === student?.tracker?.id || (!t.studentId && t.state === 'ACTIVE'),
  )
  const pending = createStudent.isPending || updateStudent.isPending

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const base = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gender: form.gender || undefined,
    }
    if (student) {
      const trackerChanged = form.trackerId !== (student.tracker?.id ?? '')
      updateStudent.mutate(
        {
          id: student.id,
          data: {
            ...base,
            className: form.className.trim(),
            birthDate: form.birthDate,
            parentName: form.parentName.trim(),
            parentPhone: form.parentPhone.trim(),
            ...(trackerChanged ? { trackerId: form.trackerId || null } : {}),
          },
        },
        { onSuccess: onClose },
      )
    } else {
      createStudent.mutate(
        {
          ...base,
          className: form.className.trim() || undefined,
          birthDate: form.birthDate || undefined,
          parentName: form.parentName.trim() || undefined,
          parentPhone: form.parentPhone.trim() || undefined,
          trackerId: form.trackerId || undefined,
        },
        { onSuccess: onClose },
      )
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      icon={student ? 'edit' : 'person_add'}
      title={student ? `Modifier ${student.firstName} ${student.lastName}` : 'Ajouter un élève'}
      size="lg"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={pending}>Annuler</Btn>
          <Btn type="submit" form="student-form" loading={pending}>
            {student ? 'Enregistrer' : "Ajouter l'élève"}
          </Btn>
        </>
      }
    >
      <form id="student-form" onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Prénom *">
          <input required autoFocus value={form.firstName} onChange={(e) => set({ firstName: e.target.value })} placeholder="Ex. Awa" className={inputClass} />
        </Field>
        <Field label="Nom *">
          <input required value={form.lastName} onChange={(e) => set({ lastName: e.target.value })} placeholder="Ex. DIOP" className={inputClass} />
        </Field>
        <Field label="Classe">
          <input value={form.className} onChange={(e) => set({ className: e.target.value })} placeholder="Ex. CM2" className={inputClass} />
        </Field>
        <Field label="Genre">
          <select value={form.gender} onChange={(e) => set({ gender: e.target.value as Gender | '' })} className={inputClass}>
            <option value="">Non précisé</option>
            {Object.entries(GENDER_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </Field>
        <Field label="Date de naissance">
          <input type="date" value={form.birthDate} onChange={(e) => set({ birthDate: e.target.value })} max={new Date().toISOString().slice(0, 10)} className={inputClass} />
        </Field>
        <div className="hidden sm:block" />

        <Field label="Nom du parent">
          <input value={form.parentName} onChange={(e) => set({ parentName: e.target.value })} placeholder="Ex. Fatou Diop" className={inputClass} />
        </Field>
        <Field
          label="Téléphone du parent"
          hint="Le parent reçoit les alertes s'il a un compte BAAWA vérifié avec ce numéro."
        >
          <input type="tel" value={form.parentPhone} onChange={(e) => set({ parentPhone: e.target.value })} placeholder="77 123 45 67" className={inputClass} />
        </Field>

        <Field
          label="Boîtier GPS"
          className="sm:col-span-2"
          hint={
            choices.length === 0 ? (
              <>Aucun boîtier libre. Consultez l'écran <Link to="/trackers" className="font-bold text-[#2563eb]">Boîtiers</Link> ou demandez-en à BAAWA.</>
            ) : student?.tracker && form.trackerId !== student.tracker.id ? (
              form.trackerId
                ? `Le boîtier actuel (${trackerName(student.tracker)}) redeviendra libre.`
                : `Le boîtier ${trackerName(student.tracker)} sera retiré et redeviendra libre.`
            ) : undefined
          }
        >
          <select value={form.trackerId} onChange={(e) => set({ trackerId: e.target.value })} className={inputClass} disabled={choices.length === 0}>
            <option value="">Aucun boîtier</option>
            {choices.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label ? `${t.label} — IMEI ${t.imei}` : `IMEI ${t.imei}`}
              </option>
            ))}
          </select>
        </Field>
      </form>
    </Dialog>
  )
}
