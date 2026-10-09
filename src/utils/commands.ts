import type { CommandParam, CommandTemplate } from '../api/types'

/** Commandes libres que le serveur tient pour risquées : elles peuvent détacher le boîtier de BAAWA. */
export const RISKY_COMMAND = /^\s*(SERVER|APN|FACTORY|RESET)\b/i

export const COMMAND_FORMAT = /^[\x20-\x7E]{1,160}#$/

export const PARAM_TYPE_LABELS: Record<CommandParam['type'], string> = {
  text: 'Texte',
  number: 'Nombre',
  phone: 'Numéro de téléphone',
  phones: 'Plusieurs numéros',
}

/** Variables citées dans un modèle, sans doublon ({parent} compris). */
export function placeholdersOf(template: string): string[] {
  return [...new Set([...template.matchAll(/\{([A-Za-z][A-Za-z0-9]*)\}/g)].map((m) => m[1]))]
}

/**
 * Aperçu de la commande qui sera envoyée. Le serveur refait l'assemblage et
 * contrôle les valeurs : ceci ne sert qu'à montrer le résultat à l'admin.
 * Un champ encore vide reste affiché {entre accolades}.
 */
export function previewCommand(template: CommandTemplate, values: Record<string, string>): string {
  let command = template.template
  for (const param of template.params) {
    const raw = (values[param.key] ?? param.defaultValue ?? '').trim()
    if (!raw) continue
    const value = param.type === 'phones'
      ? raw.split(/[,;\n]/).map((v) => v.replace(/[\s.\-()]/g, '')).filter(Boolean).join(',')
      : param.type === 'phone' ? raw.replace(/[\s.\-()]/g, '') : raw
    command = command.split(`{${param.key}}`).join(value)
  }
  return command
}

/** Champs requis encore vides. */
export function missingParams(template: CommandTemplate, values: Record<string, string>): CommandParam[] {
  return template.params.filter(
    (p) => p.required !== false && !(values[p.key] ?? p.defaultValue ?? '').trim(),
  )
}
