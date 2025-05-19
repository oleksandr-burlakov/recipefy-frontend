export interface AddRecipeModel {
  receiptCategoryId: string,
  title: string,
  description: string,
  instructions: string,
  preparationTimeMinutes: number,
  cookingTimeMinutes: number,
  tagIds: string[],
  ingredientIds: string[]
}
