import { defineStore } from 'pinia'
import axiosInstance from '@/services/axios.service.ts'
import type { LoginResponse } from '@/models/auth/LoginResponse.model.ts'

interface User {
  username: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  }),

  actions: {
    async login(username: string, password: string): boolean {
      try {
        const response = await axiosInstance.post<LoginResponse>('/api/auth/login', {
          username,
          password,
        })

        if (response.status != 200) {
          return false;
        }

        const data: LoginResponse = response.data;
        this.user = { username: username }
        this.accessToken = data.token
        this.refreshToken = data.refreshToken
        this.isAuthenticated = true

        // Store tokens in localStorage
        localStorage.setItem('accessToken', this.accessToken)
        localStorage.setItem('refreshToken', this.refreshToken)
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (error) {
        return false;
      }
    },

    async register(username: string, email: string, password: string) {
      try {
        const response = await
          axiosInstance.post('/api/auth/register', {
            username,
            email,
            password
          })

        if (response.status != 200) {
          throw new Error('Registration failed')
        }
        return true
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      }
    },

    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.isAuthenticated = false
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    },

    initializeAuth() {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const user = localStorage.getItem('user')

      if (
        accessToken &&
        refreshToken &&
        user &&
        accessToken != 'undefined' &&
        refreshToken != 'undefined' &&
        user != 'undefind'
      ) {
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        this.user = JSON.parse(user)
        this.isAuthenticated = true
      }
    },
  },
})
