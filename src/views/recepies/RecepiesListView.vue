<script setup lang="ts">
import { Button } from 'primevue'
import router from '@/router'
</script>
<template>
  <div class="flex justify-between mb-2">
    <h2 class="text-2xl">List of recipes</h2>
    <Button type="button" severity="secondary" size="small"
      @click="router.push({'path': '/recepies/form'})"
      >
      Add new recipe
    </Button>
  </div>
</template>

<style scoped>
</style>
