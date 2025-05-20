import { defineStore } from 'pinia'
import type { RecipeModel } from '@/models/recipe/Recipe.model.ts'
import { recipeService } from '@/services/recipe.service.ts'
import type { AddRecipeModel } from '@/models/recipe/AddRecipe.model.ts'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [] as RecipeModel[],
    isInit: false,
  }),

  actions: {
    async init() {
      try {
        if (!this.isInit) {
          const data = await recipeService.getAll()
          this.recipes = data
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.isInit = true
      }
    },
    async add(recipe: AddRecipeModel) {
      try {
        await recipeService.add(recipe)
        await this.init()
      } catch (error) {
        console.error(error)
      }
    },
    async delete(recipeId: string) {
      try {
        await recipeService.delete(recipeId)
        const index = this.recipes.findIndex((pc) => pc.id === recipeId)
        this.recipes.splice(index, 1)
      } catch (error) {
        console.error(error)
      }
    },
  },
})
