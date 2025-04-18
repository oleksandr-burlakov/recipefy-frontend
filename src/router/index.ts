import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue')
    },
    {
      path: '/product',
      name: 'product',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'main',
          component: () => import('../views/product/ProductListView.vue')
        },
        {
          path: 'category',
          name: 'product-category',
          component: () => import('../views/product-categories/ProductCategoryListView.vue')
        }
      ]
    }
    // {
    //   path: '/protected',
    //   meta: { requiresAuth: true },
    // },
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated && from.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router
