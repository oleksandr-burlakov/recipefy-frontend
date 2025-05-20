import axiosInstance from '@/services/axios.service.ts'
import type { AddRecipeCategoryModel } from '@/models/recipe-category/AddRecipeCategory.model.ts'
import type { RecipeCategoryModel } from '@/models/recipe-category/RecipeCategory.model.ts'

export const recipeCategoryService = {
  getAll: async () => {
    const response = await axiosInstance.get<RecipeCategoryModel[]>(`/api/recipeCategory`)
    return response.data
  },
  add: async (recipeCategory: AddRecipeCategoryModel) => {
    const response = await axiosInstance.post(`/api/recipeCategory`, recipeCategory)
    return response.status == 200;
  },
  delete: async(id: string) => {
    const response = await axiosInstance.delete(`/api/recipeCategory/${id}`)
    return response.status == 200
  }
}
