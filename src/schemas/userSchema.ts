import { z } from 'zod'
import { Role } from '../api/types'

export const createUserSchema = z
  .object({
    email: z.string().email('Email invalide'),
    firstName: z.string().min(2, 'Le prénom doit faire au moins 2 caractères'),
    lastName: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
    phoneNumber: z
      .string()
      .regex(/^\+221\s?[679]\d{7}$/, 'Numéro de téléphone sénégalais invalide (+221 format)'),
    role: z.nativeEnum(Role),
    zoneGeo: z.string().optional(),
    // Officer fields (shown if role is POLICIER)
    badgeNumber: z.string().optional(),
    rank: z.string().optional(),
    policeUnit: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === Role.POLICIER) {
        return data.badgeNumber && data.rank && data.policeUnit
      }
      return true
    },
    {
      message: 'Les champs officier (badge, rang, unité) sont requis pour un policier',
      path: ['badgeNumber'],
    }
  )

export type CreateUserFormData = z.infer<typeof createUserSchema>

export const updateUserSchema = createUserSchema.partial().refine(
  (data) => {
    if (data.role === Role.POLICIER) {
      return data.badgeNumber && data.rank && data.policeUnit
    }
    return true
  },
  {
    message: 'Les champs officier (badge, rang, unité) sont requis pour un policier',
    path: ['badgeNumber'],
  }
)

export type UpdateUserFormData = z.infer<typeof updateUserSchema>
