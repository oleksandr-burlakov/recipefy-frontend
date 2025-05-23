<script setup lang="ts">
import { Button, Column, DataTable } from 'primevue'
import { useRecipeStore } from '@/stores/recipe.ts'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import type { RecipeModel } from '@/models/recipe/Recipe.model.ts'
import { useRouter } from 'vue-router'

const recipeStore = useRecipeStore()
const { recipes } = storeToRefs(recipeStore)

onMounted(async () => {
  await recipeStore.init()
})

const deleteRecipe = async (recipe: RecipeModel) => {
  await recipeStore.delete(recipe.id);
}

const router = useRouter();

function goToRecipeForm() {
  router.push({ path: '/recepies/form' });
}

</script>
<template>
  <div class="flex justify-between mb-2">
    <h2 class="text-2xl">List of recipes</h2>
    <Button type="button" severity="secondary" size="small"
      @click="goToRecipeForm"
      >
      Add new recipe
    </Button>
  </div>
  <div>
    <DataTable :value="recipes" paginator :rows="5" size="small">
      <Column field="title" header="Title"/>
      <Column field="description" header="Description" />

      <Column :exportable="false">
        <template #body="{ data }">
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            @click="deleteRecipe(data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
</style>
