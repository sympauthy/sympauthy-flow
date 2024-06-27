import { inject, type InjectionKey } from 'vue'
import type { Router } from 'vue-router'
import { or } from 'ajv/dist/compile/codegen'

export function injectRequired<T>(key: InjectionKey<T> | string): T {
  const injected = inject(key)
  if (injected === undefined) {
    throw new Error('Failed to inject required dependencies.')
  }
  return injected
}

/**
 * Redirect the end-user
 *
 * @param router
 * @param redirectUri
 */
export async function redirectOrPush(router: Router, redirectUri: string) {
  const origin = document.location.origin
  if (redirectUri.startsWith(origin)) {
    const path = redirectUri.substring(origin.length)
    await router.push({
      path: path
    })
  } else {
    document.location = redirectUri
  }
}
