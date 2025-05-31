import { MeasurementUnits } from '@/constants/enums/measurement-units.ts'

export interface AddIngredientModel {
  recipeId: string
  productId: string
  units: MeasurementUnits
  quantity: number
}
