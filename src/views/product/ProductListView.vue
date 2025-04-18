<template>
  <div class="flex justify-between mb-2">
    <h2 class="text-2xl">Product List</h2>
    <Button type="button" severity="secondary" size="small" @click="isAddDialogVisible = true"
      >Add new product</Button
    >
  </div>
  <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
    <Card v-for="product in products" :key="product.id" class="max-w-sm mx-auto w-full">
      <template #header>
        <img
          v-if="product.image"
          :src="product.image"
          alt="Product Image"
          class="w-full h-32 object-cover rounded-t-md"
        />
        <div v-else class="w-full h-32 bg-gray-200 rounded-t-md"></div>
      </template>
      <template #title>
        <div class="flex">
          <h2 class="text-md font-semibold">{{ product.name }}</h2>
          <Button
            type="button"
            icon="pi pi-trash"
            class="ml-auto"
            severity="secondary"
            size="small"
            @click="onDeleteProduct(product.id)"
          />
        </div>
      </template>
      <template #content>
        <p class="text-gray-500 mb-2">{{ product.description }}</p>
        <span class="text-sm text-primary">{{ product.productCategoryName }}</span>
      </template>
    </Card>
    <Suspense>
      <AddProductDialog
        v-if="isAddDialogVisible"
        :is-visible="isAddDialogVisible"
        @close-dialog="isAddDialogVisible = false"
      />
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProductsStore } from '@/stores/products.ts'
import { onMounted } from 'vue'
import { Card, Button } from 'primevue'
import AddProductDialog from '@/views/product/ProductDialog.vue'

const isAddDialogVisible = ref(false)
const productsStore = useProductsStore()
onMounted(async () => {
  await productsStore.init()
})

const products = ref(productsStore.products)

productsStore.$subscribe((mutation, state) => {
  if (mutation.storeId === 'products') {
    products.value = state.products
  }
})

const onDeleteProduct = async (productId: string) => {
  await productsStore.delete(productId)
}
</script>
<style scoped></style>
