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
 *
 * Return whether the browser is loading another page: a push has already been made by then.
 */
export async function redirectOrPush(router: Router, redirectUri: string): Promise<boolean> {
  // Only use router.push for URIs that fall under the app's base path (origin + BASE_URL).
  // URIs on the same origin but outside the base (e.g. /admin/callback when base is /flow)
  // must trigger a full page redirect to avoid Vue Router prepending the base path.
  const base = import.meta.env.BASE_URL?.replace(/\/+$/, '') ?? ''
  const baseUrl = document.location.origin + base
  if (redirectUri.startsWith(baseUrl)) {
    await router.push(makeRouteFromRedirectUri(redirectUri))
    return false
  } else {
    document.location = redirectUri
    return true
  }
}

/**
 * Return whether a click on a link follows it in place: a link opened in another tab or window is
 * a full page load, which the app does not take over.
 */
export function isClickInPlace(event: MouseEvent): boolean {
  return event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey
}

/**
 * Return the attributes of a link to [href], which while [disabled] has none: it can then be
 * followed neither in place nor in another tab, and is announced as unavailable.
 */
export function linkAttributes(
  href: string | undefined,
  disabled: boolean
): Record<string, string> {
  if (disabled || href === undefined) {
    return { role: 'link', 'aria-disabled': 'true' }
  }
  return { href }
}

/**
 * Follow a submission that may complete the session, such as a sign-in or a code being checked.
 *
 * `busy` is true while the submission is on its way, and stays true once its answer moves the
 * person on, until the page is left: another page can take seconds to load, and a control pressed
 * meanwhile would act on a session that has just completed. Only a failure ends it, or a move
 * within the app that is over, which may leave this page on screen for another step.
 */
export function useSubmission(router: Router, isSubmitting: Ref<boolean>) {
  const movingOn = ref(false)
  const busy = computed(() => isSubmitting.value || movingOn.value)

  async function moveOn(redirectUri: string) {
    movingOn.value = true
    let loadingAnotherPage = false
    try {
      loadingAnotherPage = await redirectOrPush(router, redirectUri)
    } finally {
      movingOn.value = loadingAnotherPage
    }
  }

  return { busy, moveOn }
}
