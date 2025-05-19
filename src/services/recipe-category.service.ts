import axiosInstance from '@/services/axios.service.ts'
import type { AddRecipeCategoryModel } from '@/models/recipe-category/AddRecipeCategory.model.ts'
import type { RecipeCategoryModel } from '@/models/recipe-category/RecipeCategory.model.ts'

export const recipeCategoryService = {
  getAll: async () => {
    const response = await axiosInstance.get<RecipeCategoryModel[]>(`/api/receiptCategory`)
    return response.data
  },
  add: async (productCategory: AddRecipeCategoryModel) => {
    const response = await axiosInstance.post(`/api/receiptCategory`, productCategory)
    return response.status == 200;
  },
  delete: async(id: string) => {
    const response = await axiosInstance.delete(`/api/receiptCategory/${id}`)
    return response.status == 200
  }
}
