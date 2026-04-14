import { z } from 'zod'
import { Role } from '../api/types'

// Base user schema without refinements
const baseUserSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères'),
  firstName: z.string().min(2, 'Le prénom doit faire au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  phoneNumber: z
    .string()
    .regex(/^\+221\s?[679]\d{8}$/, 'Numéro de téléphone sénégalais invalide (format: +221 77 123 45 67)'),
  role: z.nativeEnum(Role),
  // Officer fields (shown if role is POLICIER)
  badgeNumber: z.string().optional(),
  rank: z.string().optional(),
  policeUnit: z.string().optional(),
})

const policierValidation = {
  message: 'Les champs officier (badge, rang, unité) sont requis pour un policier',
  path: ['badgeNumber'],
}

export const createUserSchema = baseUserSchema.refine(
  (data) => {
    if (data.role === Role.POLICIER) {
      return data.badgeNumber && data.rank && data.policeUnit
    }
    return true
  },
  policierValidation
)

export type CreateUserFormData = z.infer<typeof createUserSchema>

// For updates, use partial first, then refine
export const updateUserSchema = baseUserSchema
  .partial()
  .refine(
    (data) => {
      if (data.role === Role.POLICIER) {
        return data.badgeNumber && data.rank && data.policeUnit
      }
      return true
    },
    policierValidation
  )

export type UpdateUserFormData = z.infer<typeof updateUserSchema>
