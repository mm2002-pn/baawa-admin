import { useState } from 'react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import {
  Btn, ConfirmDialog, Dialog, EmptyState, Field, IconBtn, Loading, PageContainer, Panel, Pill,
} from '../../components/ui/kit'
import { inputClass } from '../../components/ui/styles'
import { useCommandTemplates, useDeleteCommandTemplate, useSaveCommandTemplate } from '../../hooks/useTrackers'
import { CommandParam, CommandParamType, CommandTemplate } from '../../api/types'
import { PARAM_TYPE_LABELS, placeholdersOf } from '../../utils/commands'
import { cn } from '../../utils/cn'

const KEY_FORMAT = /^[a-z][A-Za-z0-9]{0,29}$/

/** Un champ en cours d'édition : les nombres restent en texte tant que le formulaire n'est pas enregistré. */
interface ParamDraft {
  key: string
  label: string
  type: CommandParamType
  required: boolean
  min: string
  max: string
  maxItems: string
  placeholder: string
  defaultValue: string
}

const toDraft = (p: CommandParam): ParamDraft => ({
  key: p.key,
  label: p.label,
  type: p.type,
  required: p.required !== false,
  min: p.min?.toString() ?? '',
  max: p.max?.toString() ?? '',
  maxItems: p.maxItems?.toString() ?? '',
  placeholder: p.placeholder ?? '',
  defaultValue: p.defaultValue ?? '',
})

const fromDraft = (d: ParamDraft): CommandParam => ({
  key: d.key.trim(),
  label: d.label.trim(),
  type: d.type,
  required: d.required,
  ...(d.type === 'number' && d.min !== '' ? { min: Number(d.min) } : {}),
  ...(d.type === 'number' && d.max !== '' ? { max: Number(d.max) } : {}),
  ...(d.type === 'phones' && d.maxItems !== '' ? { maxItems: Number(d.maxItems) } : {}),
  ...(d.placeholder.trim() ? { placeholder: d.placeholder.trim() } : {}),
  ...(d.defaultValue.trim() ? { defaultValue: d.defaultValue.trim() } : {}),
})

/** Création ou modification d'une entrée du catalogue. Monté uniquement quand il est ouvert. */
function TemplateFormDialog({ template, onClose }: { template?: CommandTemplate | null; onClose: () => void }) {
  const save = useSaveCommandTemplate()
  const [form, setForm] = useState({
    name: template?.name ?? '',
    description: template?.description ?? '',
    template: template?.template ?? '',
    risky: template?.risky ?? false,
    verified: template?.verified ?? false,
    sortOrder: String(template?.sortOrder ?? 100),
  })
  const [params, setParams] = useState<ParamDraft[]>((template?.params ?? []).map(toDraft))
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))
  const setParam = (i: number, patch: Partial<ParamDraft>) => setParams((ps) => ps.map((p, j) => (j === i ? { ...p, ...patch } : p)))

  // Les variables citées dans le modèle doivent avoir chacune un champ, sauf {parent}
  const text = form.template.trim()
  const cited = placeholdersOf(text).filter((k) => k !== 'parent')
  const keys = params.map((p) => p.key.trim())
  const withoutField = cited.filter((k) => !keys.includes(k))
  const unusedField = keys.filter((k) => k && !cited.includes(k))
  const badKey = params.find((p) => !KEY_FORMAT.test(p.key.trim()) || p.key.trim() === 'parent')
  const templateError = text && !/^[\x20-\x7E]{1,200}#$/.test(text) ? 'Le modèle doit se terminer par # (caractères simples).' : null
  const paramsError = badKey
    ? `« ${badKey.key || '(vide)'} » n'est pas un nom de variable valide : une minuscule, puis des lettres ou des chiffres.`
    : new Set(keys).size !== keys.length
      ? 'Deux champs portent le même nom de variable.'
      : unusedField.length
        ? `Le champ « ${unusedField[0]} » n'apparaît pas dans le modèle.`
        : params.some((p) => !p.label.trim())
          ? 'Chaque champ doit avoir un libellé.'
          : null
  const valid = !!form.name.trim() && !!text && !templateError && !paramsError && withoutField.length === 0

  const addField = (key = '') =>
    setParams((ps) => [...ps, { key, label: '', type: 'text', required: true, min: '', max: '', maxItems: '', placeholder: '', defaultValue: '' }])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate(
      {
        id: template?.id,
        data: {
          name: form.name.trim(),
          description: form.description.trim(),
          template: text,
          params: params.map(fromDraft),
          risky: form.risky,
          verified: form.verified,
          sortOrder: Number(form.sortOrder) || 0,
        },
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Dialog
      open
      onClose={onClose}
      icon="list_alt"
      title={template ? `Modifier « ${template.name} »` : 'Nouvelle commande'}
      size="lg"
      footer={
        <>
          <Btn variant="secondary" onClick={onClose} disabled={save.isPending}>Annuler</Btn>
          <Btn type="submit" form="template-form" loading={save.isPending} disabled={!valid}>
            {template ? 'Enregistrer' : 'Ajouter au catalogue'}
          </Btn>
        </>
      }
    >
      <form id="template-form" onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Nom *" hint="Ce que fait la commande, en clair. C'est ce que l'admin verra dans la liste.">
          <input required autoFocus value={form.name} onChange={(e) => set({ name: e.target.value })} maxLength={60} placeholder="Ex. Définir les numéros SOS" className={inputClass} />
        </Field>
        <Field label="Explication" hint="Ce que ça change, et ce que le boîtier répond.">
          <textarea rows={2} value={form.description} onChange={(e) => set({ description: e.target.value })} maxLength={400} className={cn(inputClass, 'resize-none')} />
        </Field>
        <Field
          label="Modèle de commande *"
          error={templateError}
          hint="Le texte envoyé au boîtier, terminé par #. Écrivez {entre accolades} chaque valeur à saisir, par exemple SOS,A,{numeros}#. {parent} est rempli automatiquement avec le numéro du parent."
        >
          <input required value={form.template} onChange={(e) => set({ template: e.target.value })} maxLength={200} spellCheck={false} placeholder="SOS,A,{numeros}#" className={cn(inputClass, 'font-mono')} />
        </Field>

        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12.5px] font-bold text-[#475467]">Champs à remplir</p>
            <Btn size="sm" variant="secondary" icon="add" onClick={() => addField()}>Ajouter un champ</Btn>
          </div>

          {withoutField.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#fedf89] bg-[#fffaeb] px-4 py-3 mb-2 text-[13px] font-semibold text-[#b54708]">
              Le modèle cite {withoutField.map((k) => `{${k}}`).join(', ')} sans champ correspondant.
              {withoutField.map((k) => (
                <Btn key={k} size="sm" variant="secondary" onClick={() => addField(k)}>Créer le champ {k}</Btn>
              ))}
            </div>
          )}

          {params.length === 0 ? (
            <p className="text-[13px] text-[#98a2b3]">Aucun champ : la commande est envoyée telle quelle.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {params.map((p, i) => (
                <div key={i} className="rounded-[13px] border border-[#eef1f5] bg-[#f9fafc] p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-[1fr_1.4fr_1.2fr_auto] gap-2 items-end">
                    <Field label="Variable">
                      <input value={p.key} onChange={(e) => setParam(i, { key: e.target.value })} placeholder="numeros" spellCheck={false} className={cn(inputClass, 'font-mono py-[9px]')} />
                    </Field>
                    <Field label="Libellé du champ">
                      <input value={p.label} onChange={(e) => setParam(i, { label: e.target.value })} placeholder="Numéros SOS" className={cn(inputClass, 'py-[9px]')} />
                    </Field>
                    <Field label="Type">
                      <select value={p.type} onChange={(e) => setParam(i, { type: e.target.value as CommandParamType })} className={cn(inputClass, 'py-[9px]')}>
                        {(Object.keys(PARAM_TYPE_LABELS) as CommandParamType[]).map((t) => <option key={t} value={t}>{PARAM_TYPE_LABELS[t]}</option>)}
                      </select>
                    </Field>
                    <IconBtn icon="delete" label="Retirer ce champ" tone="red" onClick={() => setParams((ps) => ps.filter((_, j) => j !== i))} />
                  </div>
                  <div className="flex flex-wrap items-end gap-3 mt-2">
                    {p.type === 'number' && (
                      <>
                        <Field label="Minimum" className="w-[110px]">
                          <input type="number" value={p.min} onChange={(e) => setParam(i, { min: e.target.value })} className={cn(inputClass, 'py-[9px]')} />
                        </Field>
                        <Field label="Maximum" className="w-[110px]">
                          <input type="number" value={p.max} onChange={(e) => setParam(i, { max: e.target.value })} className={cn(inputClass, 'py-[9px]')} />
                        </Field>
                      </>
                    )}
                    {p.type === 'phones' && (
                      <Field label="Numéros au maximum" className="w-[170px]">
                        <input type="number" min={1} max={15} value={p.maxItems} onChange={(e) => setParam(i, { maxItems: e.target.value })} placeholder="4" className={cn(inputClass, 'py-[9px]')} />
                      </Field>
                    )}
                    <Field label="Valeur par défaut" className="flex-1 min-w-[150px]">
                      <input value={p.defaultValue} onChange={(e) => setParam(i, { defaultValue: e.target.value })} className={cn(inputClass, 'py-[9px]')} />
                    </Field>
                    <label className="flex items-center gap-2 pb-[11px] text-[13px] font-semibold text-[#475467] cursor-pointer">
                      <input type="checkbox" checked={p.required} onChange={(e) => setParam(i, { required: e.target.checked })} className="w-4 h-4 accent-[#2563eb]" />
                      Obligatoire
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
          {paramsError && <p className="text-[12.5px] font-semibold text-[#d92d20] mt-2">{paramsError}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.verified} onChange={(e) => set({ verified: e.target.checked })} className="mt-0.5 w-4 h-4 accent-[#2563eb]" />
            <span className="text-[13px] text-[#475467]">
              <strong className="text-[#101828]">Vérifiée sur un vrai boîtier.</strong> À cocher une fois que la commande a été envoyée et que le boîtier a répondu comme prévu.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.risky} onChange={(e) => set({ risky: e.target.checked })} className="mt-0.5 w-4 h-4 accent-[#d92d20]" />
            <span className="text-[13px] text-[#475467]">
              <strong className="text-[#101828]">À risque.</strong> La commande peut rendre le boîtier injoignable (serveur, réseau, remise à zéro). Une confirmation sera exigée avant chaque envoi.
            </span>
          </label>
        </div>

        <Field label="Ordre d'affichage" hint="Les plus petits nombres apparaissent en premier." className="w-[200px]">
          <input type="number" value={form.sortOrder} onChange={(e) => set({ sortOrder: e.target.value })} className={inputClass} />
        </Field>
      </form>
    </Dialog>
  )
}

export default function CommandCataloguePage() {
  const { data: templates, isLoading } = useCommandTemplates()
  const save = useSaveCommandTemplate()
  const remove = useDeleteCommandTemplate()
  // `undefined` : fermé ; `null` : création ; sinon l'entrée en cours de modification
  const [editing, setEditing] = useState<CommandTemplate | null | undefined>(undefined)
  const [deleting, setDeleting] = useState<CommandTemplate | null>(null)

  return (
    <AdminLayout title="Catalogue de commandes" backTo="/fleet">
      <PageContainer>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[13.5px] text-[#667085] max-w-[640px]">
            Les commandes proposées quand on envoie une action aux boîtiers. Chaque entrée traduit une commande du boîtier en action claire, avec les champs à remplir. Ajoutez ici celles du manuel du fabricant au fur et à mesure.
          </p>
          <Btn icon="add" onClick={() => setEditing(null)}>Nouvelle commande</Btn>
        </div>

        {isLoading ? (
          <Loading />
        ) : !templates?.length ? (
          <Panel>
            <EmptyState
              icon="list_alt"
              title="Le catalogue est vide"
              text="Ajoutez une première commande pour que les admins n'aient plus à connaître sa syntaxe."
              action={<Btn icon="add" onClick={() => setEditing(null)}>Nouvelle commande</Btn>}
            />
          </Panel>
        ) : (
          <div className="flex flex-col gap-3">
            {templates.map((t) => (
              <div key={t.id} className={cn('flex flex-wrap items-start gap-x-4 gap-y-3 bg-white border border-[#e8ecf2] rounded-2xl px-4 py-4', !t.isActive && 'opacity-60')}>
                <div className="flex items-center justify-center w-[46px] h-[46px] rounded-[14px] bg-[#eef4ff] text-[#2563eb] shrink-0">
                  <span className="material-symbols-outlined text-[23px]">terminal</span>
                </div>
                <div className="flex-1 min-w-[240px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-extrabold text-[15px] text-[#101828]">{t.name}</p>
                    {t.verified
                      ? <Pill tone="green" icon="verified">Vérifiée</Pill>
                      : <Pill tone="amber" title="Pas encore essayée sur un vrai boîtier">Non vérifiée</Pill>}
                    {t.risky && <Pill tone="red" icon="warning">À risque</Pill>}
                    {!t.isActive && <Pill tone="slate">Masquée</Pill>}
                  </div>
                  {t.description && <p className="text-[13px] text-[#667085] mt-1">{t.description}</p>}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <code className="font-mono text-[12.5px] text-[#101828] bg-[#f9fafc] border border-[#e2e7ee] rounded-md px-2 py-0.5">{t.template}</code>
                    {t.params.map((p) => (
                      <span key={p.key} className="text-[12px] font-semibold text-[#98a2b3]">
                        {p.label} ({PARAM_TYPE_LABELS[p.type].toLowerCase()})
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  <IconBtn
                    icon={t.isActive ? 'visibility_off' : 'visibility'}
                    label={t.isActive ? "Masquer de la liste d'envoi" : "Proposer de nouveau à l'envoi"}
                    tone="blue"
                    disabled={save.isPending}
                    onClick={() => save.mutate({ id: t.id, data: { isActive: !t.isActive } })}
                  />
                  <IconBtn icon="edit" label="Modifier" tone="blue" onClick={() => setEditing(t)} />
                  <IconBtn icon="delete" label="Retirer du catalogue" tone="red" onClick={() => setDeleting(t)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContainer>

      {editing !== undefined && <TemplateFormDialog template={editing} onClose={() => setEditing(undefined)} />}

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        loading={remove.isPending}
        danger
        title="Retirer cette commande ?"
        confirmLabel="Retirer"
        message={
          <>
            <strong className="text-[#101828]">{deleting?.name}</strong> ne sera plus proposée. L'historique des commandes déjà envoyées est conservé. Pour la cacher sans la perdre, utilisez plutôt l'icône « masquer ».
          </>
        }
      />
    </AdminLayout>
  )
}
