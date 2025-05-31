<script setup lang="ts">
import { Button, Column, DataTable } from 'primevue'
import { useRecipeStore } from '@/stores/recipe.ts'
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import type { RecipeModel } from '@/models/recipe/Recipe.model.ts'
import { useRouter } from 'vue-router'

const recipeStore = useRecipeStore()
const { recipes } = storeToRefs(recipeStore)

onMounted(async () => {
  await recipeStore.init()
})

const deleteRecipe = async (recipe: RecipeModel) => {
  await recipeStore.delete(recipe.id)
}

const enhancedRecipes = computed(() => {
  return recipes.value.map((recipe) => ({
    ...recipe,
    description: recipe.description.length < 100 ? recipe.description : recipe.description.substring(0, 100) + '...',
    ingredientCount: recipe.ingredients.length,
    totalPreparationTime: recipe.preparationTimeMinutes + recipe.cookingTimeMinutes,
    categoryName: recipe.recipeCategory?.name ?? 'No category',
  }))
})

const router = useRouter()

function goToRecipeForm() {
  router.push({ path: '/recepies/form' })
}
</script>
<template>
  <div class="flex justify-between mb-2">
    <h2 class="text-2xl">List of recipes</h2>
    <Button type="button" severity="secondary" size="small" @click="goToRecipeForm">
      Add new recipe
    </Button>
  </div>
  <div>
    <DataTable :value="enhancedRecipes" paginator :rows="5" size="small">
      <Column field="title" header="Title" />
      <Column field="description" header="Description" />
      <Column field="categoryName" header="Category" />
      <Column field="ingredientCount" header="Ingredients" />
      <Column field="totalPreparationTime" header="Total Preparation time" />

      <Column :exportable="false" class="w-25">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button
              icon="pi pi-eye"
              outlined
              rounded
              severity="info"
              @click="router.push({ path: `/recepies/view/${data.id}` })"
            />
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              severity="warning"
              @click="router.push({ path: `/recepies/form/${data.id}` })"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="deleteRecipe(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped></style>
