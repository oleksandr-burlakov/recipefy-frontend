import { defineStore } from 'pinia'
import type { ProductCategoryModel } from '@/models/product-category/ProductCategory.model.ts'
import { productCategoryService } from '@/services/product-category.service.ts'
import type { AddProductCategoryModel } from '@/models/product-category/AddProductCategory.model.ts'

export const useProductCategoriesStore = defineStore('product-categories', {
  state: () => ({
    productCategories: [] as ProductCategoryModel[],
    isInit: false,
  }),

  actions: {
    async init() {
      try {
        if (!this.isInit) {
          this.productCategories = await productCategoryService.getAll()
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.isInit = true
      }
    },
    async add(productCategory: AddProductCategoryModel) {
      try {
        await productCategoryService.add(productCategory)
        this.productCategories.splice(0, this.productCategories.length, ...await productCategoryService.getAll())
      } catch (error) {
        console.error(error)
      }
    },
    async delete(productCategoryId: string) {
      try {
        await productCategoryService.delete(productCategoryId)
        const index = this.productCategories.findIndex((pc) => pc.id === productCategoryId)
        this.productCategories.splice(index, 1)
      } catch (error) {
        console.error(error)
      }
    },
  },
})
