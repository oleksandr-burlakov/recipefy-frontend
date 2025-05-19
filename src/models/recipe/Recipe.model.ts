export interface RecipeModel {
  id: string,
  title: string,
  description: string,
  instructions: string,
  preparationTimeMinutes: number,
  cookingTimeMinutes: number,
  tags: string[],
  category: string,
  ingredients: string[],
}
