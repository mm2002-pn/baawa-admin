import { apiClient } from '../client'
import { School, Student, CreateSchoolDto, CreateSchoolUserDto } from '../types'

export const schoolsService = {
  getAll: async (page = 1, limit = 10, search?: string): Promise<{ data: School[]; total: number }> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.append('search', search)
    const res = await apiClient.get(`/schools?${params.toString()}`)
    return (res as any).data
  },
  getById: async (id: string): Promise<School> => {
    const res = await apiClient.get(`/schools/${id}`)
    return (res as any).data
  },
  create: async (data: CreateSchoolDto): Promise<School> => {
    const res = await apiClient.post('/schools', data)
    return (res as any).data
  },
  update: async (id: string, data: Partial<CreateSchoolDto>): Promise<School> => {
    const res = await apiClient.patch(`/schools/${id}`, data)
    return (res as any).data
  },
  toggleActive: async (id: string): Promise<School> => {
    const res = await apiClient.patch(`/schools/${id}/toggle-active`, {})
    return (res as any).data
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/schools/${id}`)
  },
  createAdmin: async (id: string, data: CreateSchoolUserDto) => {
    const res = await apiClient.post(`/schools/${id}/users`, data)
    return (res as any).data
  },
  getStudents: async (id: string): Promise<Student[]> => {
    const res = await apiClient.get(`/schools/${id}/students`)
    return (res as any).data
  },
}
