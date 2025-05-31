import type { IngredientDraftModel } from '@/models/ingredient/IngredientDraft.model.ts'

export interface AddRecipeModel {
  recipeCategoryId: string,
  title: string,
  description: string,
  instructions: string,
  preparationTimeMinutes: number,
  cookingTimeMinutes: number,
  tagIds: string[],
  ingredients: IngredientDraftModel[]
}
