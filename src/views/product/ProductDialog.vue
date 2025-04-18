<script setup lang="ts">
import { Dialog, InputText, Button, Select, Textarea, FileUpload } from 'primevue'
import { useProductsStore } from '@/stores/products.ts'
import { useProductCategoriesStore } from '@/stores/product-categories'
import { ref } from 'vue'
import type { AddProductModel, ModifyProductModel } from '@/models/product/AddProduct.model'
import type { ProductModel } from '@/models/product/Product.model'

const productStore = useProductsStore()
const productCateogryStore = useProductCategoriesStore()

await productCateogryStore.init()
await productStore.init()

const props = defineProps<{
  isVisible: boolean
  product?: ProductModel
}>()
const emit = defineEmits(['closeDialog', 'addedNew'])

const productCategories = ref(await productCateogryStore.productCategories)

const productRef = ref<ModifyProductModel>({
  name: props.product?.name || '',
  description: props.product?.description || '',
  image: props.product?.image || '',
  productCategoryId: props.product?.productCategoryId || '',
  id: props.product?.id || '',
})

const addNewProduct = async () => {
  try {
    if (!productRef.value.name && !productRef.value.productCategoryId) {
      console.error('Invalid product')
    } else {
      if (!productRef.value.id) {
        await productStore.add(productRef.value as AddProductModel)
      } else {
        // await productStore.update(productRef.value as ModifyProductModel) TODO: update
      }
      emit('closeDialog')
    }
  } catch (error) {
    console.log(error)
  }
}

const onFileSelected = (event: any) => {
  const file = event.files[0]
  const reader = new FileReader()

  reader.onload = async (e) => {
    productRef.value.image = e.target.result as string
  }

  reader.readAsDataURL(file)
}
</script>

<template>
  <Dialog
    :visible="props.isVisible"
    @update:visible="$emit('closeDialog')"
    modal
    header="Add new product"
    :style="{ width: '25rem' }"
  >
    <form @submit.prevent="addNewProduct" class="flex flex-col">
      <div class="flex items-center gap-4 mb-4">
        <InputText
          v-model="productRef.name"
          id="name"
          placeholder="Name"
          class="flex-auto"
          autocomplete="off"
          required="true"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <Select
          v-model="productRef.productCategoryId"
          id="productCategoryId"
          placeholder="Category"
          :options="productCategories"
          optionLabel="name"
          optionValue="id"
          class="flex-auto"
          required="true"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <Textarea
          v-model="productRef.description"
          id="description"
          placeholder="Description"
          class="flex-auto"
          rows="5"
          autocomplete="off"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <FileUpload
          mode="basic"
          accept="image/*"
          :max-file-size="1000000"
          id="image"
          placeholder="Image"
          class="flex-auto"
          rows="5"
          autocomplete="off"
          @select="onFileSelected"
          :choose-label="'Choose Image'"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="submit" label="Save"></Button>
      </div>
    </form>
  </Dialog>
</template>

<style scoped></style>
