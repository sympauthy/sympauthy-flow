import { createRouter, createWebHistory } from 'vue-router'
import ErrorPage from '@/pages/ErrorPage.vue'
import SignInPage from '@/pages/SignInPage.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/sign-in'
    },
    {
      path: '/sign-in',
      name: 'SignIn',
      component: SignInPage
    },
    {
      path: '/error',
      name: 'Error',
      component: ErrorPage
    }
  ]
})
