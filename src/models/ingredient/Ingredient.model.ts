import { MeasurementUnits } from '@/constants/enums/measurement-units.ts'

export interface IngredientModel {
  id: string
  recipeId: string
  productId: string
  productName: string
  units: MeasurementUnits
  quantity: number
}
