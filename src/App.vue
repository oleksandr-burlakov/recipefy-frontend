<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { Menubar, Button } from 'primevue';
</script>

<template>
  <div class="flex flex-col w-full p-2">
    <header class="w-full">
      <Menubar>
        <template #start>
          <div class="wrapper">
            <nav>
              <RouterLink to="/">
                <Button label="Home" variant="link" />
              </RouterLink>
              <RouterLink to="/about">
                <Button label="About" variant="link" />
              </RouterLink>
            </nav>
          </div>
        </template>
      </Menubar>
    </header>
    <div class="flex">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>

</style>
