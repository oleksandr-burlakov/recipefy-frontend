<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { InputText, Button, Textarea, Select, MultiSelect, FloatLabel, Message } from 'primevue'
import { Form, type FormResolverOptions, type FormSubmitEvent } from '@primevue/forms'
import type { AddRecipeModel } from '@/models/recipe/AddRecipe.model'
import Editor from 'primevue/editor'
import { useRecipeCategoriesStore } from '@/stores/recipe-categories.ts'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/products.ts'
import { useRecipeStore } from '@/stores/recipe.ts'

const recipeCategoryStore = useRecipeCategoriesStore()
const productStore = useProductsStore()
const recipeStore = useRecipeStore()

const { recipeCategories } = storeToRefs(recipeCategoryStore)
const { products } = storeToRefs(productStore)

onMounted(async () => {
  await recipeCategoryStore.init()
  await productStore.init()
})

const initialValues = reactive({
  title: 'test',
  description: 'test',
  instructions: 'test',
  preparationTimeMinutes: 0,
  cookingTimeMinutes: 0
})

const resolver = ({ values }: FormResolverOptions) => {
  const errors: Record<string, [{message: string}]> = {}

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
  if (!values.preparationTimeMinutes) {
    errors.preparationTimeMinutes = [{ message: 'Preparation time is required.' }]
  }
  if (!values.cookingTimeMinutes) {
    errors.cookingTimeMinutes = [{ message: 'Cooking time is required.' }]
  }

  return {
    values, // (Optional) Used to pass current form values to submit event.
    errors,
  }
}

const onFormSubmit = ({ valid, values }: FormSubmitEvent) => {
  if (valid) {
    console.log(values);
    console.log('Form success')
    recipeStore.add({
      title: values.title,
      description: values.description,
      instructions: values.instructions,
      recipeCategoryId: values.recipeCategoryId,
      ingredientIds: values.ingredientIds,
      preparationTimeMinutes: values.preparationTimeMinutes,
      cookingTimeMinutes: values.cookingTimeMinutes,
      tagIds: []
    });
  }
}
</script>

<template>
  <div>
    <h2>Recipe form</h2>
    <Form
      v-slot="$form"
      :initialValues
      :resolver
      @submit="onFormSubmit"
      class="flex flex-col gap-4 my-3"
    >
      <div class="flex flex-col">
        <FloatLabel variant="in">
          <InputText id="title" name="title" required class="w-full" />
          <label for="title">Title</label>
        </FloatLabel>
        <Message v-if="$form.title?.invalid" severity="error" size="small" variant="simple"
          >{{ $form.title.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col">
        <FloatLabel variant="in">
          <Textarea id="description" name="description" required class="w-full" />
          <label for="description">Description</label>
        </FloatLabel>
        <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">
          {{ $form.description.error?.message }}
        </Message>
      </div>
      <div class="flex flex-row gap-4">
        <FloatLabel variant="in" class="w-1/2">
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
          <Message v-if="$form.recipeCategoryId?.invalid" severity="error" size="small" variant="simple">
            {{ $form.recipeCategoryId.error?.message }}
          </Message>
        </FloatLabel>
        <FloatLabel variant="in" class="w-1/2">
          <MultiSelect
            :filter="true"
            id="ingredientIds"
            name="ingredientIds"
            multiple
            :options="products"
            optionLabel="name"
            optionValue="id"
            required
            class="w-full"
          />
          <label for="ingredientIds">Ingredients</label>
          <Message v-if="$form.ingredientIds?.invalid" severity="error" size="small" variant="simple">
            {{ $form.ingredientIds.error?.message }}
          </Message>
        </FloatLabel>
      </div>
      <div class="flex flex-row gap-4">
        <FloatLabel variant="in" class="w-1/2">
          <InputText
            id="preparationTimeMinutes"
            name="preparationTimeMinutes"
            type="number"
            required
            class="w-full"
          />
          <label for="preparationTimeMinutes">Preparation time (in minutes)</label>
          <Message v-if="$form.preparationTimeMinutes?.invalid" severity="error" size="small" variant="simple">
            {{ $form.preparationTimeMinutes.error?.message }}
          </Message>
        </FloatLabel>
        <FloatLabel variant="in" class="w-1/2">
          <InputText
            id="cookingTimeMinutes"
            name="cookingTimeMinutes"
            required
            class="w-full"
            type="number"
          />
          <label for="cookingTimeMinutes">Cooking time (in minutes)</label>
          <Message v-if="$form.cookingTimeMinutes?.invalid" severity="error" size="small" variant="simple">
            {{ $form.cookingTimeMinutes.error?.message }}
          </Message>
        </FloatLabel>
      </div>
      <div class="flex flex-col">
        <label for="instructions">Instructions</label>
        <Editor
          editorStyle="height: 320px"
          placeholder="Instructions"
          id="instructions"
          name="instructions"
          required
        />
        <Message v-if="$form.instructions?.invalid" severity="error" size="small" variant="simple">
          {{ $form.instructions.error?.message }}
        </Message>
        <!--          <template v-slot:toolbar>-->
        <!--            <span class="ql-formats">-->
        <!--              <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>-->
        <!--              <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>-->
        <!--              <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>-->
        <!--              <button v-tooltip.bottom="'Strikethrough'" class="ql-strike"></button>-->
        <!--              <button v-tooltip.bottom="'Image'" class="ql-image"></button>-->
        <!--              <button v-tooltip.bottom="'Header'" class="ql-header"></button>-->
        <!--              <select class="ql-header">-->
        <!--                <option value="1"></option>-->
        <!--                <option value="2"></option>-->
        <!--                <option value="3"></option>-->
        <!--                <option value="4"></option>-->
        <!--                <option value="5"></option>-->
        <!--                <option value="6"></option>-->
        <!--                <option selected></option>-->
        <!--              </select>-->
        <!--            </span>-->
        <!--          </template>-->
      </div>
      <div class="flex justify-end">
        <Button type="submit" label="Save" class="p-button-success" />
      </div>
    </Form>
  </div>
</template>

<style scoped></style>
