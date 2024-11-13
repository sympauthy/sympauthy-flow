import { inject, type InjectionKey } from 'vue'
import type { RouteLocationRaw, Router } from 'vue-router'
import { or } from 'ajv/dist/compile/codegen'

export function injectRequired<T>(key: InjectionKey<T> | string): T {
  const injected = inject(key)
  if (injected === undefined) {
    throw new Error('Failed to inject required dependencies.')
  }
  return injected
}

export function makeRouteFromRedirectUri(redirectUri: string): RouteLocationRaw {
  const redirectUrl = new URL(redirectUri)

  const route: RouteLocationRaw = {
    path: redirectUrl.pathname
  }
  if (redirectUrl.searchParams.size > 0) {
    route.query = {}
    for (const [key, value] of redirectUrl.searchParams) {
      route.query[key] = value
    }
  }
  return route
}

/**
 * Redirect the end-user either:
 * - using
 *
 * @param router
 * @param redirectUri
 */
export async function redirectOrPush(router: Router, redirectUri: string) {
  const origin = document.location.origin
  if (redirectUri.startsWith(origin)) {
    await router.push(makeRouteFromRedirectUri(redirectUri))
  } else {
    document.location = redirectUri
  }
}
