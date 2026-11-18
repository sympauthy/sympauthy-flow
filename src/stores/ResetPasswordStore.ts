import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * The identifier the end-user typed before opening the first reset page, to prefill its field.
 *
 * It is held in memory and never put in the address: an identifier typed may be somebody else's, and
 * kept out of the address it stays out of the browser's history and of the access log of the server
 * serving the flow. Any full page load empties it.
 */
export const useResetPassword = defineStore('resetPassword', () => {
  const login = ref<string>()

  return { login }
})
