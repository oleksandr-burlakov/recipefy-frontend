<script setup lang="ts">

import { Button, Dialog, InputText } from 'primevue'


const props = defineProps<{
  isVisible: boolean
}>()
const emit = defineEmits(['closeDialog'])

</script>

<template>
  <Dialog
    :visible="props.isVisible"
    @update:visible="$emit('closeDialog')"
    modal
    :draggable="false"
    header="List of recipe ingredients"
    :style="{ width: '25rem' }"
  >
    Ingredient dialog
  </Dialog>
</template>

<style scoped>

</style>
