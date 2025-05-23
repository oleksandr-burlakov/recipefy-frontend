import axiosInstance from '@/services/axios.service.ts'
import type { TagModel } from '@/models/tag/Tag.model.ts'
import type { AddTagModel } from '@/models/tag/AddTag.model.ts'

export const tagService = {
  getAll: async () => {
    const response = await axiosInstance.get<TagModel[]>(`/api/tag`)
    return response.data
  },
  getById: async (id: string) => {
    const response = await axiosInstance.get<TagModel>(`/api/tag/${id}`)
    return response.data
  },
  search: async (name: string) => {
    const response = await axiosInstance.get<TagModel[]>(`/api/tag/search/${name}`)
    return response.data
  },
  add: async (tag: AddTagModel) => {
    const response = await axiosInstance.post<TagModel>(`/api/tag`, tag)
    return response.data;
  },
  delete: async(id: string) => {
    const response = await axiosInstance.delete(`/api/tag/${id}`)
    return response.status == 200
  }
}
