import { computed, inject, type InjectionKey, type Ref, ref } from 'vue'
import type { RouteLocationRaw, Router } from 'vue-router'

export function injectRequired<T>(key: InjectionKey<T> | string): T {
  const injected = inject(key)
  if (injected === undefined) {
    throw new Error('Failed to inject required dependencies.')
  }
  return injected
}

export function makeRouteFromRedirectUri(redirectUri: string): RouteLocationRaw {
  const redirectUrl = new URL(redirectUri)
  // Strip the BASE_URL prefix from the pathname so Vue Router doesn't prepend it again.
  // e.g. with BASE_URL=/flow, "/flow/admin/callback" becomes "/admin/callback".
  const base = import.meta.env.BASE_URL?.replace(/\/+$/, '') ?? ''
  let path = redirectUrl.pathname
  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || '/'
  }

  const route: RouteLocationRaw = {
    path
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
 * - via router.push if the URI is under the app's BASE_URL (same SPA),
 * - via a full page redirect otherwise (external URL or same origin but outside BASE_URL).
 */
export async function redirectOrPush(router: Router, redirectUri: string) {
  // Only use router.push for URIs that fall under the app's base path (origin + BASE_URL).
  // URIs on the same origin but outside the base (e.g. /admin/callback when base is /flow)
  // must trigger a full page redirect to avoid Vue Router prepending the base path.
  const base = import.meta.env.BASE_URL?.replace(/\/+$/, '') ?? ''
  const baseUrl = document.location.origin + base
  if (redirectUri.startsWith(baseUrl)) {
    await router.push(makeRouteFromRedirectUri(redirectUri))
  } else {
    document.location = redirectUri
  }
}

/**
 * Follow a submission that may complete the session, such as a sign-in or a code being checked.
 *
 * `busy` is true while the submission is on its way, and stays true once its answer moves the
 * person on, until the page is left: the next page can take seconds to arrive, and a control
 * pressed meanwhile would act on a session that has just completed. Only a failure ends it.
 */
export function useSubmission(router: Router, isSubmitting: Ref<boolean>) {
  const movingOn = ref(false)
  const busy = computed(() => isSubmitting.value || movingOn.value)

  async function moveOn(redirectUri: string) {
    movingOn.value = true
    await redirectOrPush(router, redirectUri)
  }

  return { busy, moveOn }
}
