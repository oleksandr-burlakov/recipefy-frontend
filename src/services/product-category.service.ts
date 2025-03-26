import axiosInstance from '@/services/axios.service.ts'
import type { ProductCategory } from '@/models/product-category/ProductCategory.model.ts'
import type { AddProductCategory } from '@/models/product-category/AddProductCategory.model.ts'

export const productCategoryService = {
  getAll: async () => {
    const response = await axiosInstance.get<ProductCategory[]>(`/api/productCategory`)
    return response.data
  },
  getById: async (id: string) => {
    const response = await axiosInstance.get<ProductCategory>(`/api/productCategory/${id}`)
    return response.data
  },
  add: async (productCategory: AddProductCategory) => {
    const response = await axiosInstance.post(`/api/productCategory`, productCategory)
    return response.status == 200;
  },
  delete: async(id: string) => {
    const response = await axiosInstance.delete(`/api/productCategory/${id}`)
    return response.status == 200
  }
}
