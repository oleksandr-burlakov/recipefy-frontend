<script setup lang="ts">
import { Dialog, InputText, Button } from 'primevue'
import { productCategoryService } from '@/services/product-category.service.ts'
import { ref } from 'vue'

const props = defineProps<{
  isVisible: boolean
}>()
const emit = defineEmits(['closeDialog', 'newCategory'])

const categoryName = ref<string>('')

const addNewCategory = async () => {
  try {
    const newCategory = await productCategoryService.add({
      name: categoryName.value,
    })
    if (newCategory) {
      emit('newCategory')
    }
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
    header="Edit Profile"
    :style="{ width: '25rem' }"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Add new category</span>
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
      <Button type="button" label="Save" @click="addNewCategory"></Button>
    </div>
  </Dialog>
</template>

<style scoped></style>
