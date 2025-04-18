import axiosInstance from '@/services/axios.service.ts'
import type { ProductCategoryModel } from '@/models/product-category/ProductCategory.model.ts'
import type { AddProductCategoryModel } from '@/models/product-category/AddProductCategory.model.ts'

export const productCategoryService = {
  getAll: async () => {
    const response = await axiosInstance.get<ProductCategoryModel[]>(`/api/productCategory`)
    return response.data
  },
  getById: async (id: string) => {
    const response = await axiosInstance.get<ProductCategoryModel>(`/api/productCategory/${id}`)
    return response.data
  },
  add: async (productCategory: AddProductCategoryModel) => {
    const response = await axiosInstance.post(`/api/productCategory`, productCategory)
    return response.status == 200;
  },
  delete: async(id: string) => {
    const response = await axiosInstance.delete(`/api/productCategory/${id}`)
    return response.status == 200
  }
}
