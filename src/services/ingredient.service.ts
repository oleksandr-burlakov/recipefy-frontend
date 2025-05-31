import axiosInstance from '@/services/axios.service.ts'
import type { IngredientModel } from '@/models/ingredient/Ingredient.model.ts'
import type { AddIngredientModel } from '@/models/ingredient/AddIngredient.model.ts'

export const ingredientService = {
  getByRecipeId: async (recipeId: string) => {
    const response = await axiosInstance.get<IngredientModel[]>(`/api/ingredient?recipeId=${recipeId}`)
    return response.data
  },
  getById: async (id: string) => {
    const response = await axiosInstance.get<IngredientModel>(`/api/ingredient/${id}`)
    return response.data
  },
  add: async (addIngredientModel: AddIngredientModel) => {
    const response = await axiosInstance.post<IngredientModel>(`/api/ingredient`, addIngredientModel)
    return response.data;
  },
  delete: async(id: string) => {
    const response = await axiosInstance.delete(`/api/ingredient/${id}`)
    return response.status == 200
  }
}
