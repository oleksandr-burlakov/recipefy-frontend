import type { TagModel } from '@/models/tag/Tag.model.ts'
import type { IngredientModel } from '@/models/ingredient/Ingredient.model.ts'
import type { RecipeCategoryModel } from '@/models/recipe-category/RecipeCategory.model.ts'

export interface RecipeModel {
  id: string,
  title: string,
  description: string,
  instructions: string,
  preparationTimeMinutes: number,
  cookingTimeMinutes: number,
  tags: TagModel[],
  recipeCategory: RecipeCategoryModel,
  ingredients: IngredientModel[],
}
