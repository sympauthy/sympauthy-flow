import {
  createRouter,
  createWebHistory,
  type HistoryState,
  type LocationQueryValue,
  type RouteLocationNormalized,
  type RouteLocationRaw,
  type Router
} from 'vue-router'
import ErrorPage from '@/pages/ErrorPage.vue'
import SignInPage from '@/pages/SignInPage.vue'
import SignUpPage from '@/pages/SignUpPage.vue'
import { merge } from 'ts-deepmerge'
import CollectClaimsPage from '@/pages/claims/CollectClaimsPage.vue'
import ValidateClaimsPage from '@/pages/claims/ValidateClaimsPage.vue'
import MfaSelectionPage from '@/pages/mfa/MfaSelectionPage.vue'
import TotpChallengePage from '@/pages/mfa/TotpChallengePage.vue'
import TotpEnrollPage from '@/pages/mfa/TotpEnrollPage.vue'
import ConfirmPage from '@/pages/ConfirmPage.vue'
import ResetPasswordPage from '@/pages/resetpassword/ResetPasswordPage.vue'
import ResetPasswordValidatePage from '@/pages/resetpassword/ResetPasswordValidatePage.vue'
import ResetPasswordChoosePage from '@/pages/resetpassword/ResetPasswordChoosePage.vue'
import { isArrayNotEmpty } from '@/utils/ArrayUtils.ts'
import { isString, isStringNotBlankNorEmpty, isStringNotEmpty } from '@/utils/StringUtils.ts'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'

/**
 * Return the state the route carries, or undefined when it carries none: an empty or blank state
 * names no session either, and the server refuses it as it refuses a missing one.
 */
export function getStateQueryParam(route: RouteLocationNormalized): string | undefined {
  const stateQueryValues = route.query['state']

  let stateQueryValue: LocationQueryValue = null
  if (stateQueryValues instanceof Array && isArrayNotEmpty(stateQueryValues)) {
    stateQueryValue = stateQueryValues[0]
  } else if (isString(stateQueryValues)) {
    stateQueryValue = stateQueryValues
  }

  if (isStringNotBlankNorEmpty(stateQueryValue)) {
    return stateQueryValue
  } else {
    return undefined
  }
}

/**
 * Why the end-user is sent to the error page.
 */
export type ErrorReason = {
  error_code: string
  details?: string
  description?: string
}

/**
 * The code of the error a page opened with no state is sent to the error page with.
 */
export const MISSING_STATE_ERROR_CODE = 'state.unauthorized'

/**
 * Make a reason, leaving out details and a description that say nothing: the server may send them
 * empty, or as null, and the error page shows no line without a value.
 */
export function makeErrorReason(
  errorCode: string,
  details?: string | null,
  description?: string | null
): ErrorReason {
  const reason: ErrorReason = {
    error_code: errorCode
  }
  if (isStringNotEmpty(details)) {
    reason.details = details
  }
  if (isStringNotEmpty(description)) {
    reason.description = description
  }
  return reason
}

/**
 * Make the route to the error page, showing the given reason, sent by a page of the session the
 * given state names, or by a page opened with no state when it is undefined.
 *
 * The reason and the state travel in the history state rather than in the query: the error page
 * shows the reason as it is, and a link must not be able to make it show a message that neither
 * the server nor this flow wrote. Nor does a copy of the error page's address ask the server for
 * the session's error, and draw another card than the one the person was sent to.
 *
 * A missing state is written as null rather than left out: a replace merges the history state of
 * the entry it replaces, whose state would otherwise be carried over.
 */
export function makeErrorRoute(reason: ErrorReason, state?: string): RouteLocationRaw {
  return {
    name: 'Error',
    state: { error: reason, state: state ?? null }
  }
}

/**
 * Make the route to the error page for a request that failed, showing only the details the server
 * sent: the flow's own stand-in for them tells support nothing.
 */
export function makeApiErrorRoute(
  state: string | undefined,
  response: ErrorApiResponse
): RouteLocationRaw {
  return makeErrorRoute(
    makeErrorReason(response.errorCode, response.error?.details, response.description),
    state
  )
}

export function makeUnknownErrorRoute(state: string | undefined): RouteLocationRaw {
  return makeErrorRoute(makeErrorReason('unknown'), state)
}

export function makeMissingStateErrorRoute(): RouteLocationRaw {
  return makeErrorRoute(makeErrorReason(MISSING_STATE_ERROR_CODE))
}

/**
 * Return the reason a route made by makeErrorRoute carries, read from the history state it left.
 */
export function getErrorReason(historyState: HistoryState | undefined): ErrorReason | undefined {
  const error = historyState?.['error']
  if (error === null || typeof error !== 'object' || Array.isArray(error)) {
    return undefined
  }
  const { error_code, details, description } = error as HistoryState
  if (!isString(error_code)) {
    return undefined
  }
  return makeErrorReason(
    error_code,
    isString(details) ? details : undefined,
    isString(description) ? description : undefined
  )
}

/**
 * Return the state a route made by makeErrorRoute carries beside its reason, or undefined when it
 * was sent by a page opened with no state.
 */
export function getErrorState(historyState: HistoryState | undefined): string | undefined {
  const state = historyState?.['state']
  return isString(state) && isStringNotBlankNorEmpty(state) ? state : undefined
}

export function makeRouter(): Router {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        name: 'Home',
        redirect: '/sign-in'
      },
      {
        path: '/confirm',
        name: 'Confirm',
        component: ConfirmPage,
        meta: {
          stateRequired: true
        }
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
      // Each path reads as the server key an operator names it by: flows.<id>.reset-password,
      // flows.<id>.reset-password-validate and flows.<id>.reset-password-choose.
      {
        path: '/reset-password',
        name: 'ResetPassword',
        component: ResetPasswordPage,
        meta: {
          stateRequired: true
        }
      },
      {
        path: '/reset-password/validate',
        name: 'ResetPasswordValidate',
        component: ResetPasswordValidatePage,
        meta: {
          stateRequired: true
        }
      },
      {
        path: '/reset-password/choose',
        name: 'ResetPasswordChoose',
        component: ResetPasswordChoosePage,
        meta: {
          stateRequired: true
        }
      },
      {
        path: '/claims/edit',
        name: 'CollectClaims',
        component: CollectClaimsPage,
        meta: {
          stateRequired: true
        }
      },
      {
        path: '/claims/validate',
        name: 'ValidateClaims',
        component: ValidateClaimsPage,
        meta: {
          stateRequired: true
        }
      },
      {
        path: '/mfa/enrollment',
        name: 'MfaEnrollmentSelection',
        component: MfaSelectionPage,
        meta: {
          stateRequired: true,
          mfaKind: 'enrollment'
        }
      },
      {
        path: '/mfa/challenge',
        name: 'MfaChallengeSelection',
        component: MfaSelectionPage,
        meta: {
          stateRequired: true,
          mfaKind: 'challenge'
        }
      },
      {
        path: '/mfa/totp',
        name: 'TotpChallenge',
        component: TotpChallengePage,
        meta: {
          stateRequired: true
        }
      },
      {
        path: '/mfa/totp/enroll',
        name: 'TotpEnroll',
        component: TotpEnrollPage,
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
        return merge(to, {
          query: {
            state: fromState
          }
        })
      } else {
        // The state is missing, go to error page.
        return makeMissingStateErrorRoute()
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
