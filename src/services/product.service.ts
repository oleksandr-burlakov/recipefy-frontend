import axiosInstance from '@/services/axios.service.ts'
import type { ProductCategoryModel } from '@/models/product-category/ProductCategory.model.ts'
import type { AddProductCategoryModel } from '@/models/product-category/AddProductCategory.model.ts'
import type { ProductModel } from '@/models/product/Product.model.ts'
import type { AddProductModel } from '@/models/product/AddProduct.model.ts'

export const productService = {
  getAll: async () => {
    const response = await axiosInstance.get<ProductModel[]>(`/api/product`)
    return response.data
  },
  add: async (product: AddProductModel) => {
    const response = await axiosInstance.post<ProductModel | null>(`/api/product`, product)
    return response.data
  },
  delete: async (id: string) => {
    const response = await axiosInstance.delete<ProductModel | null>(`/api/product/${id}`)
    return response.data
  },
}
