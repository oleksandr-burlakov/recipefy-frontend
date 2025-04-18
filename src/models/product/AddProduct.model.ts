export interface AddProductModel {
  name: string
  description?: string | null
  image?: string | null
  productCategoryId: string
}

export interface ModifyProductModel extends AddProductModel {
  id?: string
}
