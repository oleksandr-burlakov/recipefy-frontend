import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/register',
      component: () => import('../views/auth/RegisterView.vue')
    },
    {
      path: '/product',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: () => import('../views/product/ProductListView.vue')
        },
        {
          path: 'category',
          component: () => import('@/views/product/product-categories/ProductCategoryListView.vue')
        }
      ]
    },
    {
      path: '/recepies',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: () => import('../views/recepies/RecipesListView.vue')
        },
        {
          path: 'form/:id?',
          component: () => import('../views/recepies/RecipeFormView.vue')
        },
        {
          path: 'view/:id',
          component: () => import('../views/recepies/RecipeView.vue')
        },
        {
          path: 'category',
          component: () => import('../views/recepies/categories/CategoriesListView.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated && from.path !== '/login') {
    const returnUrl = encodeURIComponent(to.fullPath)
    next(`/login?returnUrl=${returnUrl}`)
  } else {
    next()
  }
})

export default router
