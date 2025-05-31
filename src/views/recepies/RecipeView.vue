<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { recipeService } from '@/services/recipe.service.ts'
import type { RecipeModel } from '@/models/recipe/Recipe.model.ts'
import { MeasurementUnits } from '@/constants/enums/measurement-units.ts'
import { Button } from 'primevue'

const route = useRoute()
const router = useRouter()
const recipe = ref<RecipeModel | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const goBack = () => {
  router.push('/recepies')
}

onMounted(async () => {
  try {
    const id = route.params.id as string
    if (!id) {
      error.value = 'Recipe ID is required'
      return
    }

    recipe.value = await recipeService.getById(id)
    loading.value = false
  } catch (err) {
    error.value = 'Failed to load recipe'
    loading.value = false
    console.error(err)
  }
})

const getTotalTime = () => {
  if (!recipe.value) return 0
  return recipe.value.preparationTimeMinutes + recipe.value.cookingTimeMinutes
}
</script>

<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center p-8">
      <i class="pi pi-spin pi-spinner text-4xl"></i>
    </div>

    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded">
      {{ error }}
    </div>

    <div v-else-if="recipe" class="recipe-view">
      <div class="mb-4">
        <Button
          icon="pi pi-arrow-left"
          label="Back to Recipes"
          severity="secondary"
          text
          @click="goBack"
        />
      </div>

      <div class="flex justify-between mb-4">
        <h2 class="text-2xl font-bold">{{ recipe.title }}</h2>
        <div class="text-sm text-gray-600">
          <span class="mr-2">Preparation: {{ recipe.preparationTimeMinutes }} min</span>
          <span class="mr-2">Cooking: {{ recipe.cookingTimeMinutes }} min</span>
          <span>Total: {{ getTotalTime() }} min</span>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">Description</h3>
        <p>{{ recipe.description }}</p>
      </div>

      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">Category</h3>
        <p>{{ recipe.recipeCategory?.name || 'No category' }}</p>
      </div>

      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">Ingredients</h3>
        <ul class="list-disc pl-5">
          <li v-for="ingredient in recipe.ingredients" :key="ingredient.id" class="mb-1">
            {{ ingredient.productName || 'Unknown product' }} - {{ ingredient.quantity }} {{ MeasurementUnits[ingredient.units] }}
          </li>
        </ul>
        <p v-if="recipe.ingredients.length === 0" class="text-gray-500">No ingredients</p>
      </div>

      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-2">Instructions</h3>
        <div v-html="recipe.instructions"></div>
      </div>

      <div v-if="recipe.tags && recipe.tags.length > 0" class="mb-4">
        <h3 class="text-lg font-semibold mb-2">Tags</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in recipe.tags"
            :key="tag.id"
            class="px-2 py-1 bg-orange-950 rounded-full text-sm"
          >
            {{ tag.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

/* Fix text overflow issues */
p, div, li {
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: normal;
  hyphens: none;
}

/* Ensure instructions content doesn't overflow */
div[v-html] {
  max-width: 100%;
  overflow-wrap: break-word;
  word-break: normal;
  hyphens: none;
}
</style>
