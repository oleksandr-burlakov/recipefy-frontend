import { defineStore } from 'pinia'
import type { AddRecipeCategoryModel } from '@/models/recipe-category/AddRecipeCategory.model.ts'
import type { TagModel } from '@/models/tag/Tag.model.ts'
import { tagService } from '@/services/tag.service.ts'

export const useTagStore = defineStore('tag', {
  state: () => ({
    tags: [] as TagModel[],
    isInit: false,
  }),

  actions: {
    async init() {
      try {
        if (!this.isInit) {
          this.tags = await tagService.getAll()
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.isInit = true
      }
    },
    async add(recipeCategory: AddRecipeCategoryModel) {
      try {
        const tag = await tagService.add(recipeCategory)
        if (tag != null) {
          this.tags.push(tag)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async delete(tagId: string) {
      try {
        await tagService.delete(tagId)
        const index = this.tags.findIndex((pc) => pc.id === tagId)
        this.tags.splice(index, 1)
      } catch (error) {
        console.error(error)
      }
    },
    async search(name: string) {
      try {
        this.tags = await tagService.search(name)
      } catch (error) {
        console.error(error)
      }
    },
    async getAll() {
      try {
        this.tags = await tagService.getAll()
      } catch (error) {
        console.error(error)
      }
    },
  },
})
