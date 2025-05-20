import axiosInstance from '@/services/axios.service.ts'
import type { RecipeModel } from '@/models/recipe/Recipe.model.ts'
import type { AddRecipeModel } from '@/models/recipe/AddRecipe.model.ts'

export const recipeService = {
  getAll: async () => {
    const response = await axiosInstance.get<RecipeModel[]>(`/api/recipe`)
    return response.data
  },
  getById: async (id: string) => {
    const response = await axiosInstance.get<RecipeModel>(`/api/recipe/${id}`)
    return response.data
  },
  add: async (recipe: AddRecipeModel) => {
    const response = await axiosInstance.post(`/api/recipe`, recipe)
    return response.status == 200;
  },
  delete: async(id: string) => {
    const response = await axiosInstance.delete(`/api/recipe/${id}`)
    return response.status == 200
  }
}
