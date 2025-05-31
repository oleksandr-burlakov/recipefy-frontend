<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  InputText,
  Button,
  Textarea,
  Select,
  FloatLabel,
  Message,
  AutoComplete,
  type AutoCompleteCompleteEvent,
} from 'primevue'
import { Form, type FormResolverOptions, type FormSubmitEvent } from '@primevue/forms'
import Editor from 'primevue/editor'
import { useRecipeCategoriesStore } from '@/stores/recipe-categories.ts'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/products.ts'
import { useRecipeStore } from '@/stores/recipe.ts'
import { useTagStore } from '@/stores/tag.ts'
import AddIngredientDialog from '@/views/recepies/AddIngredientDialog.vue'
import type { IngredientDraftModel } from '@/models/ingredient/IngredientDraft.model.ts'
import { recipeService } from '@/services/recipe.service.ts'
import { useRouter, useRoute } from 'vue-router'
import type { RecipeModel } from '@/models/recipe/Recipe.model.ts'

const recipeCategoryStore = useRecipeCategoriesStore()
const productStore = useProductsStore()
const recipeStore = useRecipeStore()
const tagStore = useTagStore()
const router = useRouter()
const route = useRoute()

const { recipeCategories } = storeToRefs(recipeCategoryStore)
const { tags } = storeToRefs(tagStore)

const isIngredientsDialogVisible = ref(false)
const isEditMode = ref(false)
const recipeId = ref<string | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const draftIngredients = ref<IngredientDraftModel[]>([])

const goBack = () => {
  router.push('/recepies')
}

onMounted(async () => {
  await recipeCategoryStore.init()
  await productStore.init()
  await tagStore.init()

  // Check if we're in edit mode
  const id = route.params.id as string
  if (id) {
    isEditMode.value = true
    recipeId.value = id
    try {
      const recipe = await recipeService.getById(id)
      // Update initial values with recipe data
      initialValues.title = recipe.title
      initialValues.description = recipe.description
      initialValues.instructions = recipe.instructions
      initialValues.preparationTimeMinutes = recipe.preparationTimeMinutes
      initialValues.cookingTimeMinutes = recipe.cookingTimeMinutes
      initialValues.recipeCategoryId = recipe.recipeCategory?.id

      // Set ingredients
      draftIngredients.value = recipe.ingredients.map(ingredient => ({
        productId: ingredient.productId,
        productName: ingredient.productName,
        quantity: ingredient.quantity,
        units: ingredient.units
      }))

      // Set tags
      if (recipe.tags && recipe.tags.length > 0) {
        initialValues.tags = recipe.tags
      }
    } catch (err) {
      error.value = 'Failed to load recipe'
      console.error(err)
    }
  }

  loading.value = false
})

const initialValues = reactive({
  title: '',
  description: '',
  instructions: '',
  preparationTimeMinutes: 0,
  cookingTimeMinutes: 0,
  recipeCategoryId: '',
  tags: []
})

const resolver = ({ values }: FormResolverOptions) => {
  const errors: Record<string, [{ message: string }]> = {}

  if (!values.title) {
    errors.title = [{ message: 'Title is required.' }]
  }
  if (!values.description) {
    errors.description = [{ message: 'Description is required.' }]
  }
  if (!values.instructions) {
    errors.instructions = [{ message: 'Instructions is required.' }]
  }
  if (!values.recipeCategoryId) {
    errors.recipeCategoryId = [{ message: 'Recipe category is required.' }]
  }
  if (!values.ingredientIds) {
    errors.ingredientIds = [{ message: 'Ingredients is required.' }]
  }
  if (values.preparationTimeMinutes === null || values.preparationTimeMinutes === undefined) {
    errors.preparationTimeMinutes = [{ message: 'Preparation time is required.' }]
  }
  if (!values.cookingTimeMinutes === null || values.cookingTimeMinutes === undefined) {
    errors.cookingTimeMinutes = [{ message: 'Cooking time is required.' }]
  }

  return {
    values, // (Optional) Used to pass current form values to submit event.
    errors,
  }
}

const onFormSubmit = async ({ valid, values }: FormSubmitEvent) => {
  if (valid) {
    const recipeData = {
      title: values.title,
      description: values.description,
      instructions: values.instructions,
      recipeCategoryId: values.recipeCategoryId,
      ingredients: [...draftIngredients.value],
      preparationTimeMinutes: values.preparationTimeMinutes,
      cookingTimeMinutes: values.cookingTimeMinutes,
      tagIds: values.tags?.map((t: { id: string }) => t.id),
    };

    let response;
    if (isEditMode.value && recipeId.value) {
      response = await recipeStore.update({
        ...recipeData,
        id: recipeId.value
      });
    } else {
      response = await recipeStore.add(recipeData);
    }

    if (response !== null) {
      router.push({ path: `/recepies` });
    }
  }
}

const tagName = ref('')
const searchTags = async (event: AutoCompleteCompleteEvent) => {
  tagName.value = event.query.trim()
  if (!event.query.trim().length) {
    await tagStore.getAll()
  } else {
    await tagStore.search(event.query.trim())
  }
}

const addNewTag = async () => {
  await tagStore.add({ name: tagName.value })
  tagName.value = ''
}

const openIngredientsPopup = async () => {
  isIngredientsDialogVisible.value = true
}

const addIngredient = async (draftIngredient: IngredientDraftModel) => {
  draftIngredients.value.push(draftIngredient)
}

const removeIngredient = (ingredient: IngredientDraftModel) => {
  const index = draftIngredients.value.findIndex(
    item => item.productId === ingredient.productId &&
            item.units === ingredient.units &&
            item.quantity === ingredient.quantity
  )
  if (index !== -1) {
    draftIngredients.value.splice(index, 1)
  }
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

    <div v-else>
      <div class="mb-4">
        <Button
          icon="pi pi-arrow-left"
          label="Back to Recipes"
          severity="secondary"
          text
          @click="goBack"
        />
      </div>

      <h2>{{ isEditMode ? 'Edit Recipe' : 'Create Recipe' }}</h2>
      <Form
        v-slot="$form"
        :initialValues
        :resolver
        @submit="onFormSubmit"
        class="flex flex-col gap-4 my-3"
      >
      <div class="flex lg:flex-row flex-col gap-4">
        <div class="left-part lg:w-1/2 w-full flex flex-col  gap-4">
          <div class="flex flex-row gap-4">
            <div class="flex flex-col w-full">
              <FloatLabel variant="in">
                <InputText id="title" name="title" required class="w-full" />
                <label for="title">Title</label>
              </FloatLabel>
              <Message v-if="$form.title?.invalid" severity="error" size="small" variant="simple"
                >{{ $form.title.error?.message }}
              </Message>
            </div>
            <Button size="small" @click="openIngredientsPopup"> Ingredients</Button>
          </div>
          <div class="flex sm:flex-row flex-col gap-4">
            <FloatLabel variant="in" class="sm:w-2/4 w-full">
              <Select
                id="recipeCategoryId"
                name="recipeCategoryId"
                :options="recipeCategories"
                optionLabel="name"
                optionValue="id"
                required
                class="w-full"
              />
              <label for="recipeCategoryId">Recipe Category</label>
              <Message
                v-if="$form.recipeCategoryId?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.recipeCategoryId.error?.message }}
              </Message>
            </FloatLabel>
            <FloatLabel variant="in" class="sm:w-1/4 w-full">
              <InputText
                id="preparationTimeMinutes"
                name="preparationTimeMinutes"
                type="number"
                required
                class="w-full"
              />
              <label for="preparationTimeMinutes">Preparation time (in minutes)</label>
              <Message
                v-if="$form.preparationTimeMinutes?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.preparationTimeMinutes.error?.message }}
              </Message>
            </FloatLabel>
            <FloatLabel variant="in" class="sm:w-1/4 w-full">
              <InputText
                id="cookingTimeMinutes"
                name="cookingTimeMinutes"
                required
                class="w-full"
                type="number"
              />
              <label for="cookingTimeMinutes">Cooking time (in minutes)</label>
              <Message
                v-if="$form.cookingTimeMinutes?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.cookingTimeMinutes.error?.message }}
              </Message>
            </FloatLabel>
          </div>
          <div>
            <FloatLabel variant="in">
              <Textarea id="description" name="description" required class="w-full" rows="5" />
              <label for="description">Description</label>
            </FloatLabel>
            <Message
              v-if="$form.description?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.description.error?.message }}
            </Message>
          </div>
          <div>
            <FloatLabel variant="in" class="w-full">
              <AutoComplete
                id="tags"
                name="tags"
                required
                class="w-full"
                :suggestions="tags"
                @complete="searchTags"
                optionLabel="name"
                multiple
              >
                <template #option="slotProps">
                  <div class="flex items-center">
                    <div>{{ slotProps.option.name }}</div>
                  </div>
                </template>
                <template #header>
                  <div class="font-medium px-3 py-2">Available Tags</div>
                </template>
                <template #footer>
                  <div class="px-3 py-3">
                    <Button
                      label="Add New"
                      fluid
                      severity="secondary"
                      text
                      size="small"
                      icon="pi pi-plus"
                      @click="addNewTag"
                    />
                  </div>
                </template>
              </AutoComplete>
              <label for="tags">Tags</label>
            </FloatLabel>
          </div>
        </div>
        <div class="lg:w-2/3 w-full">
          <div class="flex flex-col">
            <Editor
              editorStyle="height: 650px"
              placeholder="Instructions"
              id="instructions"
              name="instructions"
              required
            />
            <Message
              v-if="$form.instructions?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.instructions.error?.message }}
            </Message>
          </div>
        </div>
      </div>
      <div class="flex justify-end">
        <Button type="submit" label="Save" class="p-button-success" />
      </div>
    </Form>
    </div>
  </div>
  <AddIngredientDialog
    :is-visible="isIngredientsDialogVisible"
    @closeDialog="isIngredientsDialogVisible = false"
    @addIngredient="addIngredient"
    @removeIngredient="removeIngredient"
    :ingredients="draftIngredients"
  />
</template>

<style scoped>
.left-part {
  max-height: 500px;
}
</style>
