<template>
  <div class="flex justify-center items-center min-h-screen w-full">
    <div class="w-full max-w-md mx-auto">
      <Card class="w-full">
        <template #title>
          <h2 class="text-center">Login</h2>
        </template>
        <template #content>
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 w-full">
            <div class="flex flex-col w-full">
              <span class="p-float-label w-full">
                <InputText id="username" v-model="username" required class="w-full" />
                <label for="username">Username</label>
              </span>
            </div>
            <div class="flex flex-col w-full">
              <span class="p-float-label w-full">
                <Password
                  id="password"
                  v-model="password"
                  required
                  toggleMask
                  :feedback="false"
                  class="w-full"
                  inputClass="w-full"
                />
                <label for="password">Password</label>
              </span>
            </div>
            <Message v-if="error" severity="error" class="w-full">{{ error }}</Message>
            <Button type="submit" label="Login" class="w-full" />
          </form>
          <div class="mt-4 text-center w-full">
            Don't have an account?
            <RouterLink to="/register" class="text-primary">Register here</RouterLink>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')

const handleSubmit = async () => {
  try {
    await authStore.login(username.value, password.value)
    router.push('/') // Redirect to home page after successful login
  } catch (err) {
    console.log(err)
    error.value = 'Login failed. Please check your credentials.'
  }
}
</script>

<style scoped></style>
