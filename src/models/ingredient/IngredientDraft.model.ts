import { MeasurementUnits } from '@/constants/enums/measurement-units.ts'

export interface IngredientDraftModel {
  id?: string
  productId: string
  units: MeasurementUnits
  quantity: number
}
