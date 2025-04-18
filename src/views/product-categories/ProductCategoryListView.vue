<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ProductCategoryModel } from '@/models/product-category/ProductCategory.model.ts'
import { Button, DataTable, Column } from 'primevue'
import AddProductCategoryDialog from '@/views/product-categories/AddProductCategoryDialog.vue'
import { useProductCategoriesStore } from '@/stores/product-categories.ts'
import { storeToRefs } from 'pinia'

const productCategoryStore = useProductCategoriesStore();
const { productCategories } = storeToRefs(productCategoryStore);
const isAddDialogVisible = ref(false);

onMounted(async () => {
    await productCategoryStore.init();
})

const deleteCategory = async (productCategory: ProductCategoryModel) => {
  try {
    await productCategoryStore.delete(productCategory.id);
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
      <DataTable :value="productCategories" paginator :rows="5" size="small">
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
  <AddProductCategoryDialog :is-visible="isAddDialogVisible" @close-dialog="isAddDialogVisible = false" />
</template>

<style scoped></style>
