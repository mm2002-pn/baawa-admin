import { apiClient } from '../client'
import { Student, CreateStudentDto, UpdateStudentDto } from '../types'

export const studentsService = {
  getAll: async (search?: string): Promise<Student[]> => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    const res = await apiClient.get(`/students?${params.toString()}`)
    return (res as any).data
  },
  getById: async (id: string): Promise<Student> => {
    const res = await apiClient.get(`/students/${id}`)
    return (res as any).data
  },
  create: async (data: CreateStudentDto): Promise<Student> => {
    const res = await apiClient.post('/students', data)
    return (res as any).data
  },
  update: async (id: string, data: UpdateStudentDto): Promise<Student> => {
    const res = await apiClient.patch(`/students/${id}`, data)
    return (res as any).data
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/students/${id}`)
  },
}
