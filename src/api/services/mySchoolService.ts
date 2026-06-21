import { apiClient } from '../client'
import { School, SchoolUser, CreateSchoolUserDto } from '../types'

export const mySchoolService = {
  get: async (): Promise<School> => {
    const res = await apiClient.get('/my-school')
    return (res as any).data
  },
  getUsers: async (): Promise<SchoolUser[]> => {
    const res = await apiClient.get('/my-school/users')
    return (res as any).data
  },
  createUser: async (data: CreateSchoolUserDto): Promise<SchoolUser> => {
    const res = await apiClient.post('/my-school/users', data)
    return (res as any).data
  },
  toggleUser: async (id: string): Promise<SchoolUser> => {
    const res = await apiClient.patch(`/my-school/users/${id}/toggle-active`, {})
    return (res as any).data
  },
}
