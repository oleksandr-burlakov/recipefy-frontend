<script setup lang="ts">
import { Dialog, InputText, Button } from 'primevue'
import { ref } from 'vue'
import { useProductCategoriesStore } from '@/stores/product-categories.ts'

const productCategoryStore = useProductCategoriesStore();
const props = defineProps<{
  isVisible: boolean
}>()
const emit = defineEmits(['closeDialog'])

const categoryName = ref<string>('')

const addNewCategory = async () => {
  try {
    await productCategoryStore.add({name: categoryName.value})
    emit('closeDialog')
    categoryName.value = ''
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <Dialog
    :visible="props.isVisible"
    @update:visible="$emit('closeDialog')"
    modal
    header="Add new category"
    :style="{ width: '25rem' }"
  >
    <form @submit.prevent="addNewCategory">
      <div class="flex items-center gap-4 mb-4">
        <InputText
          v-model="categoryName"
          id="categoryName"
          placeholder="Category name"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="submit" label="Save"></Button>
      </div>
    </form>
  </Dialog>
</template>

<style scoped></style>
