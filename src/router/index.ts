import { createRouter, createWebHistory } from 'vue-router'
import SignInView from '@/views/SignInView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: 'signin'
    },
    {
      path: '/sign-in',
      name: 'signin',
      component: SignInView
    }
  ]
})

export default router
