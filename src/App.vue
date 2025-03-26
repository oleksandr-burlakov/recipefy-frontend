<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Menubar, Button } from 'primevue'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const authStore = useAuthStore()

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    route: '/',
  },
  {
    label: 'About',
    icon: 'pi pi-star',
    route: '/about',
  },
  {
    label: 'Product',
    items: [
      {
        label: 'Category',
        route: '/product/category',
      },
    ],
  },
])
</script>

<template>
  <div class="flex flex-col w-full p-2 gap-4">
    <div v-if="authStore.isAuthenticated">
      <header class="w-full">
        <Menubar :model="items">
          <template #item="{ item, props, hasSubmenu, root }">
            <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a v-ripple :href="href" class="flex items-center" v-bind="props.action" @click="navigate">
                <span class="text-primary" :class="item.icon"></span>
                <span class="text-primary">{{ item.label }}</span>
              </a>
            </router-link>
            <a v-else v-ripple class="flex items-center" v-bind="props.action">
              <span class="text-primary" :class="item.icon"></span>
              <span class="text-primary">{{ item.label }}</span>
              <i
                v-if="hasSubmenu"
                :class="[
                    'pi pi-angle-down ml-auto text-primary',
                    { 'pi-angle-down': root, 'pi-angle-right': !root },
                  ]"
              ></i>
            </a>
          </template>
          <template #end>
            <div class="flex items-center gap-4">
              <span class="text-sm">{{ authStore.user?.username }}</span>
              <Button
                label="Logout"
                variant="link"
                @click="
                  () => {
                    authStore.logout()
                    $router.push('/login')
                  }
                "
              />
            </div>
          </template>
        </Menubar>
      </header>
    </div>
    <div class="flex flex-col">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
