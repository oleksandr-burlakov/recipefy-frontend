import { defineStore } from 'pinia'
import type { IngredientModel } from '@/models/ingredient/Ingredient.model.ts'
import { ingredientService } from '@/services/ingredient.service.ts'
import type { AddIngredientModel } from '@/models/ingredient/AddIngredient.model.ts'

export const useIngredientsStore = defineStore('ingredients', {
  state: () => ({
    ingredients: [] as IngredientModel[],
  }),

  actions: {
    async getByRecipeId(recipeId: string) {
      try {
        this.ingredients.splice(
          0,
          this.ingredients.length,
          ...(await ingredientService.getByRecipeId(recipeId)),
        )
      } catch (error) {
        console.error(error)
      }
    },
    async add(ingredients: AddIngredientModel) {
      try {
        const response = await ingredientService.add(ingredients)
        this.ingredients.push(response)
      } catch (error) {
        console.error(error)
      }
    },
    async delete(ingredientId: string) {
      try {
        await ingredientService.delete(ingredientId)
        const index = this.ingredients.findIndex((i) => i.id === ingredientId)
        this.ingredients.splice(index, 1)
      } catch (error) {
        console.error(error)
      }
    },
  },
})
