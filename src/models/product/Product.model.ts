export interface ProductModel {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  productCategoryId: string;
  productCategoryName: string;
}
