import {
  createRouter,
  createWebHistory,
  type LocationQueryValue,
  type RouteLocationNormalized,
  type RouteLocationRaw,
  type Router
} from 'vue-router'
import ErrorPage from '@/pages/ErrorPage.vue'
import SignInPage from '@/pages/SignInPage.vue'
import SignUpPage from '@/pages/SignUpPage.vue'
import type { Pinia } from 'pinia'
import type { I18n } from 'vue-i18n'
import merge from 'ts-deepmerge'

export function getStateQueryParam(route: RouteLocationNormalized): string | undefined {
  const stateQueryValues = route.query['state']

  let stateQueryValue: LocationQueryValue = null
  if (stateQueryValues instanceof Array && stateQueryValues.length > 0) {
    stateQueryValue = stateQueryValues[0]
  } else if (!(stateQueryValues instanceof Array)) {
    stateQueryValue = stateQueryValues
  }

  if (stateQueryValue !== null) {
    return stateQueryValue
  } else {
    return undefined
  }
}

export function makeErrorRoute(
  errorCode: string,
  details?: string,
  description?: string
): RouteLocationRaw {
  const queryParams: Record<string, string> = {
    'error_code': errorCode
  }
  if (details !== undefined) {
    queryParams['details'] = details
  }
  if (description !== undefined) {
    queryParams['description'] = description
  }
  return {
    name: 'Error',
    query: queryParams
  }
}

export function makeTranslatedErrorRoute(
  i18n: I18n,
  errorCode: string,
  detailsMessageId?: string,
  descriptionMessageId?: string
): RouteLocationRaw {
  return makeErrorRoute(
    errorCode,
    detailsMessageId !== undefined ? i18n.global.t(detailsMessageId) : undefined,
    descriptionMessageId !== undefined ? i18n.global.t(descriptionMessageId) : undefined
  )
}

export function makeUnknownErrorRoute(i18n: I18n): RouteLocationRaw {
  return makeTranslatedErrorRoute(
    i18n, 'unknown',
    'errors.unknown.details', 'errors.unknown.description'
  )
}

export function makeRouter(i18n: I18n): Router {
  const router = createRouter({
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
        component: SignInPage,
        meta: {
          stateRequired: true
        }
      },
      {
        path: '/sign-up',
        name: 'SignUp',
        component: SignUpPage,
        meta: {
          stateRequired: true
        }
      },
      {
        path: '/error',
        name: 'Error',
        component: ErrorPage
      }
    ]
  })

  async function handleRequiredState(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
  ): Promise<RouteLocationNormalized | RouteLocationRaw | void> {
    const toState = getStateQueryParam(to)

    // The state is not already set. Try recovering it from the from route.
    if (toState === undefined) {
      const fromState = getStateQueryParam(from)
      if (fromState !== undefined) {
        // The state was present, copy the state and redirect to the to page with the state query param.
        return merge(
          to,
          {
            query: {
              state: fromState
            }
          }
        )
      } else {
        // The state is missing, go to error page.
        return makeTranslatedErrorRoute(
          i18n, 'state.unauthorized',
          'errors.missing_state.details', 'errors.missing_state.description'
        )
      }
    }

    // If the state param is set, we can navigate to the to page.
    return
  }

  router.beforeEach(async (to, from) => {
    if (to.meta.stateRequired === true) {
      return handleRequiredState(to, from)
    }
  })

  return router
}
