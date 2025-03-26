import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { definePreset } from '@primeuix/themes'

const app = createApp(App)
const pinia = createPinia()

const MyPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      dark: {
        surface: {
          0: '#ffffff',
          50: '{stone.50}',
          100: '{stone.100}',
          200: '{stone.200}',
          300: '{stone.300}',
          400: '{stone.400}',
          500: '{stone.500}',
          600: '{stone.600}',
          700: '{stone.700}',
          800: '{stone.800}',
          900: '{stone.900}',
          950: '{stone.950}'
        },
        primary: {
          color: '{amber.500}',
          activeColor: '{amber.600}',
          hoverColor: '{amber.700}',
          contrastColor: '{rose.800}',
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)'
        },
        focusRing: {
          width: '2px',
          style: 'dashed',
          color: '{primary.color}',
          offset: '1px'
        }
      },
    },
  },
})

app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: true,
    },
  },
})
app.use(pinia)
app.use(router)

// Initialize auth store
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
