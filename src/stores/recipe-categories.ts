import { defineStore } from 'pinia'
import type { RecipeCategoryModel } from '@/models/recipe-category/RecipeCategory.model.ts'
import { recipeCategoryService } from '@/services/recipe-category.service.ts'
import type { AddRecipeCategoryModel } from '@/models/recipe-category/AddRecipeCategory.model.ts'

export const useRecipeCategoriesStore = defineStore('recipe-categories', {
  state: () => ({
    recipeCategories: [] as RecipeCategoryModel[],
    isInit: false,
  }),

  actions: {
    async init() {
      try {
        if (!this.isInit) {
          const data = await recipeCategoryService.getAll()
          this.recipeCategories = data
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.isInit = true
      }
    },
    async add(recipeCategory: AddRecipeCategoryModel) {
      try {
        await recipeCategoryService.add(recipeCategory)
        this.recipeCategories.splice(0, this.recipeCategories.length, ...await recipeCategoryService.getAll())
      } catch (error) {
        console.error(error)
      }
    },
    async delete(recipeCategoryId: string) {
      try {
        await recipeCategoryService.delete(recipeCategoryId)
        const index = this.recipeCategories.findIndex((pc) => pc.id === recipeCategoryId)
        this.recipeCategories.splice(index, 1)
      } catch (error) {
        console.error(error)
      }
    },
  },
})
