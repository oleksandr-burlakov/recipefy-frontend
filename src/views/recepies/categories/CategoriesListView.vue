<script setup lang="ts">
import { useRecipeCategoriesStore } from '@/stores/recipe-categories.ts'
import { onMounted, ref } from 'vue'
import { Button, Column, DataTable } from 'primevue'
import { storeToRefs } from 'pinia'
import type { RecipeCategoryModel } from '@/models/recipe-category/RecipeCategory.model.ts'
import AddCategoryDialog from '@/views/recepies/categories/AddCategoryDialog.vue'

const recipeCategoryStore = useRecipeCategoriesStore();
const isAddDialogVisible = ref(false);
const { recipeCategories } = storeToRefs(recipeCategoryStore);


onMounted(async () => {
  await recipeCategoryStore.init();
})

const deleteCategory = async (recipeCategory: RecipeCategoryModel) => {
  try {
    await recipeCategoryStore.delete(recipeCategory.id);
  } catch (error) {
    console.log(error)
  }
}

</script>

<template>
  <header class="flex justify-between items-end">
    <h1 id="page-title" class="text-xl uppercase font-bold">Product categories</h1>
    <Button label="Add new category" @click="isAddDialogVisible = true" size="small" severity="secondary" />
  </header>
  <div class="flex gap-3 mt-2">
    <div class="w-full">
      <DataTable :value="recipeCategories" paginator :rows="5" size="small">
        <Column field="name" header="Name"></Column>
        <Column :exportable="false">
          <template #body="{ data }">
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="deleteCategory(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <AddCategoryDialog :is-visible="isAddDialogVisible" @close-dialog="isAddDialogVisible = false" />
</template>

<style scoped>
</style>
