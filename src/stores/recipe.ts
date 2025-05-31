import { defineStore } from 'pinia'
import type { RecipeModel } from '@/models/recipe/Recipe.model.ts'
import { recipeService } from '@/services/recipe.service.ts'
import type { AddRecipeModel } from '@/models/recipe/AddRecipe.model.ts'
import type { UpdateRecipeModel } from '@/models/recipe/UpdateRecipe.model.ts'

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
    async delete(recipeId: string) {
      try {
        await recipeService.delete(recipeId)
        const index = this.recipes.findIndex((pc) => pc.id === recipeId)
        this.recipes.splice(index, 1)
      } catch (error) {
        console.error(error)
      }
    },
    async add(recipe: AddRecipeModel) {
      try {
        const recipeResult = await recipeService.add(recipe)
        if (recipeResult.status == 200) {
          this.recipes.push(recipeResult.data);
        }
        return recipeResult
      } catch (error) {
        console.error(error)
      }
    },
    async update(recipe: UpdateRecipeModel) {
      try {
        const recipeResult = await recipeService.update(recipe)
        if (recipeResult.status == 200) {
          const index = this.recipes.findIndex((pc) => pc.id === recipe.id)
          this.recipes[index] = recipeResult.data;
        }
        return recipeResult
      } catch (error) {
        console.error(error)
      }
    },
  },
})
