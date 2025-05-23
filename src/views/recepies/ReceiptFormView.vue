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

const recipeCategoryStore = useRecipeCategoriesStore()
const productStore = useProductsStore()
const recipeStore = useRecipeStore()
const tagStore = useTagStore()

const { recipeCategories } = storeToRefs(recipeCategoryStore)
const { tags } = storeToRefs(tagStore)

const isIngredientsDialogVisible = ref(false);

onMounted(async () => {
  await recipeCategoryStore.init()
  await productStore.init()
  await tagStore.init()
})

const initialValues = reactive({
  title: 'test',
  description: 'test',
  instructions: 'test',
  preparationTimeMinutes: 0,
  cookingTimeMinutes: 0,
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

const onFormSubmit = ({ valid, values }: FormSubmitEvent) => {
  if (valid) {
    console.log(values)
    console.log('Form success')
    console.log(values.tags.map((t) => t.id))
    // recipeStore.add({
    //   title: values.title,
    //   description: values.description,
    //   instructions: values.instructions,
    //   recipeCategoryId: values.recipeCategoryId,
    //   ingredientIds: values.ingredientIds,
    //   preparationTimeMinutes: values.preparationTimeMinutes,
    //   cookingTimeMinutes: values.cookingTimeMinutes,
    //   tagIds: []
    // });
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
  isIngredientsDialogVisible.value = true;
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
      <div class="flex lg:flex-row flex-col gap-4">
        <div class="lg:w-1/2 w-full flex flex-col justify-evenly gap-4">
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
              <Textarea id="description" name="description" required class="w-full" />
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
            <label for="instructions">Instructions</label>
            <Editor
              editorStyle="height: 320px"
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
        </div>
      </div>
      <div class="flex justify-end">
        <Button type="submit" label="Save" class="p-button-success" />
      </div>
    </Form>
  </div>
  <AddIngredientDialog :is-visible="isIngredientsDialogVisible" @closeDialog="isIngredientsDialogVisible = false" />
</template>

<style scoped></style>
