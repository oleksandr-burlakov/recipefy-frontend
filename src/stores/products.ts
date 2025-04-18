import { defineStore } from 'pinia'
import type { ProductModel } from '@/models/product/Product.model.ts'
import { productService } from '@/services/product.service.ts'
import type { AddProductModel } from '@/models/product/AddProduct.model.ts'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as ProductModel[],
    isInit: false,
  }),
  actions: {
    async init() {
      try {
        if (!this.isInit) {
          const data = await productService.getAll()
          this.products = data
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.isInit = true
      }
    },
    async add(product: AddProductModel) {
      try {
        const newProduct = await productService.add(product)
        if (newProduct) {
          this.products.push(newProduct)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async delete(id: string) {
      try {
        const deletedProduct = await productService.delete(id)
        if (deletedProduct) {
          this.products = this.products.filter((product) => product.id !== id)
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
})
