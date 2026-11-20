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
import { isString } from '@/utils/StringUtils.ts'
import { translateMessage } from '@/i18n'

export function getStateQueryParam(route: RouteLocationNormalized): string | undefined {
  const stateQueryValues = route.query['state']

  let stateQueryValue: LocationQueryValue = null
  if (stateQueryValues instanceof Array && isArrayNotEmpty(stateQueryValues)) {
    stateQueryValue = stateQueryValues[0]
  } else if (isString(stateQueryValues)) {
    stateQueryValue = stateQueryValues
  }

  if (stateQueryValue !== null) {
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

export function makeErrorReason(
  errorCode: string,
  details?: string,
  description?: string
): ErrorReason {
  const reason: ErrorReason = {
    error_code: errorCode
  }
  if (details !== undefined) {
    reason.details = details
  }
  if (description !== undefined) {
    reason.description = description
  }
  return reason
}

export function makeTranslatedErrorReason(
  errorCode: string,
  detailsMessageId?: string,
  descriptionMessageId?: string
): ErrorReason {
  return makeErrorReason(
    errorCode,
    detailsMessageId !== undefined ? translateMessage(detailsMessageId) : undefined,
    descriptionMessageId !== undefined ? translateMessage(descriptionMessageId) : undefined
  )
}

export function makeMissingStateErrorReason(): ErrorReason {
  return makeTranslatedErrorReason(
    'state.unauthorized',
    'errors.missing_state.details',
    'errors.missing_state.description'
  )
}

/**
 * Make the route to the error page, showing the given reason.
 *
 * The reason travels in the history state rather than in the query: the error page shows it as it
 * is, and a link must not be able to make it show a message that neither the server nor this flow
 * wrote.
 */
function makeErrorReasonRoute(reason: ErrorReason): RouteLocationRaw {
  return {
    name: 'Error',
    state: { error: reason }
  }
}

export function makeErrorRoute(
  errorCode: string,
  details?: string,
  description?: string
): RouteLocationRaw {
  return makeErrorReasonRoute(makeErrorReason(errorCode, details, description))
}

export function makeTranslatedErrorRoute(
  errorCode: string,
  detailsMessageId?: string,
  descriptionMessageId?: string
): RouteLocationRaw {
  return makeErrorReasonRoute(
    makeTranslatedErrorReason(errorCode, detailsMessageId, descriptionMessageId)
  )
}

export function makeUnknownErrorRoute(): RouteLocationRaw {
  return makeTranslatedErrorRoute('unknown', 'errors.unknown.details', 'errors.unknown.description')
}

export function makeMissingStateErrorRoute(): RouteLocationRaw {
  return makeErrorReasonRoute(makeMissingStateErrorReason())
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
