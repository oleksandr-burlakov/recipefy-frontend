<script setup lang="ts">
import { Button, Dialog, InputText, Select, useDialog } from 'primevue'
import { useProductsStore } from '@/stores/products.ts'
import { storeToRefs } from 'pinia'
import { useIngredientsStore } from '@/stores/ingredients.ts'
import { ingredientService } from '@/services/ingredient.service.ts'
import { MeasurementUnits } from '@/constants/enums/measurement-units.ts'
import { ref } from 'vue'
import type { IngredientDraftModel } from '@/models/ingredient/IngredientDraft.model.ts'

const props = defineProps<{
  isVisible: boolean
  ingredients: IngredientDraftModel[]
}>()
const emit = defineEmits(['closeDialog', 'addIngredient', 'removeIngredient'])

const productStore = useProductsStore()
const { products } = storeToRefs(productStore)

const unitOfMeasurement = Object.entries(MeasurementUnits)
  .filter(([key, _]) => isNaN(Number(key)))
  .map(([key, value]) => {
    return {
      value: value,
      name: key,
    }
  })

const ingredientProduct = ref<string | null>()
const ingredientUnitOfMeasurement = ref<number | null>(null)
const ingredientQuantity = ref<string | null>(null)

const addNewIngredient = async () => {
  if (
    ingredientProduct.value &&
    ingredientUnitOfMeasurement.value !== null &&
    ingredientUnitOfMeasurement.value !== undefined &&
    ingredientQuantity.value
  ) {
    emit('addIngredient', {
      productId: ingredientProduct.value,
      units: ingredientUnitOfMeasurement.value,
      quantity: Number(ingredientQuantity.value),
    })
    ingredientProduct.value = null
    ingredientUnitOfMeasurement.value = null
    ingredientQuantity.value = null
  }
}

const removeIngredient = (ingredient: IngredientDraftModel) => {
  emit('removeIngredient', ingredient)
}
</script>

<template>
  <Dialog
    :visible="props.isVisible"
    @update:visible="$emit('closeDialog')"
    modal
    :draggable="false"
    header="List of recipe ingredients"
    class="sm:w-7/12"
  >
    <table class="table-auto relative overflow-x-auto w-full">
      <thead class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <tr>
          <th>Name</th>
          <th>Unit of measurement</th>
          <th>Quantity</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="gap-2">
        <tr v-for="ingredient in ingredients" :key="ingredient.id">
          <td>{{ products.find((x) => x.id === ingredient.productId)?.name }}</td>
          <td>{{ unitOfMeasurement.find((x) => x.value === ingredient.units)?.name }}</td>
          <td>{{ ingredient.quantity }}</td>
          <td>
            <Button
              icon="pi pi-trash"
              class="p-button-danger p-button-sm"
              @click="removeIngredient(ingredient)"
              aria-label="Remove ingredient"
            />
          </td>
        </tr>
      </tbody>
      <tfoot class="mt-3">
        <tr>
          <td>
            <Select
              :options="products"
              optionLabel="name"
              optionValue="id"
              placeholder="Product"
              showClear
              v-model="ingredientProduct"
            />
          </td>
          <td>
            <Select
              :options="unitOfMeasurement"
              optionLabel="name"
              optionValue="value"
              placeholder="Unit of measurement"
              v-model="ingredientUnitOfMeasurement"
            />
          </td>
          <td>
            <InputText type="number" v-model="ingredientQuantity" />
          </td>
          <td>
            <Button label="Add" class="p-button-success" @click="addNewIngredient()" />
          </td>
        </tr>
      </tfoot>
    </table>
  </Dialog>
</template>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  table-layout: fixed;
}

th, td {
  padding: 0.75rem;
  vertical-align: middle;
  border-bottom: 1px solid #e2e8f0;
}

tbody tr:last-child td {
  border-bottom: 2px solid #e2e8f0;
}

.p-dropdown, .p-select, .p-component {
  width: 100%;
  min-height: 38px;
}

.p-inputtext, .p-dropdown, .p-select, .p-button, .p-component {
  margin: 0;
}


</style>
