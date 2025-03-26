<script setup lang="ts">
import { productCategoryService } from '@/services/product-category.service.ts'
import { ref, onMounted } from 'vue'
import type { ProductCategory } from '@/models/product-category/ProductCategory.model.ts'
import { Button, DataTable, Column } from 'primevue'
import AddProductCategoryDialog from '@/views/product-categories/AddProductCategoryDialog.vue'

const productCategories = ref<ProductCategory[]>([])
const isAddDialogVisible = ref(false);

onMounted(async () => {
  try {
    productCategories.value = await productCategoryService.getAll()
  } catch (error) {
    console.error(error)
  }
})

const onCategoryAdd = async () => {
  try {
    productCategories.value = await productCategoryService.getAll()
    isAddDialogVisible.value = false;
  } catch (error) {
    console.log(error)
  }
}

const deleteCategory = async (productCategory: ProductCategory) => {
  try {
    await productCategoryService.delete(productCategory.id)
    productCategories.value = await productCategoryService.getAll()
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
  <AddProductCategoryDialog :is-visible="isAddDialogVisible" @close-dialog="isAddDialogVisible = false" @newCategory="onCategoryAdd" />
</template>

<style scoped></style>
