import type { AddRecipeModel } from '@/models/recipe/AddRecipe.model.ts'

export interface UpdateRecipeModel extends AddRecipeModel {
  id: string
}
