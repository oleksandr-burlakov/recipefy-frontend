<script setup lang="ts">
import Card from 'primevue/card'
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-4xl font-bold mb-4 text-white">Welcome to Our App</h1>
    <p class="text-lg text-gray-300 mb-8">
      This is a secure application with authentication features.
    </p>

    <div class="flex flex-col gap-4 max-w-md text-center">
      <Card>
        <template #content>
          <h2 class="text-xl font-semibold mb-2 text-white">Getting Started</h2>
          <p class="text-gray-300">Login or register to access all features of the application.</p>
        </template>
      </Card>

      <Card>
        <template #content>
          <h2 class="text-xl font-semibold mb-2 text-white">Features</h2>
          <ul class="list-disc list-inside text-left text-gray-300">
            <li>Secure authentication</li>
            <li>Protected routes</li>
            <li>User management</li>
          </ul>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped></style>
