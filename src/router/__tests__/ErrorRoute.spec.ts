import { describe, expect, it } from 'vitest'
import type { HistoryState, RouteLocationNamedRaw } from 'vue-router'
import {
  getErrorReason,
  makeErrorRoute,
  makeMissingStateErrorRoute,
  makeUnknownErrorRoute
} from '@/router'

function historyStateOf(route: unknown): HistoryState | undefined {
  return (route as RouteLocationNamedRaw).state
}

describe('makeErrorRoute', () => {
  it('leads to the error page without putting the reason in the query', () => {
    const route = makeErrorRoute('flow.invalid', 'Some details.', 'Some description.')

    expect(route).toMatchObject({ name: 'Error' })
    expect((route as RouteLocationNamedRaw).query).toBeUndefined()
  })

  it('carries a reason the error page reads back', () => {
    const route = makeErrorRoute('flow.invalid', 'Some details.', 'Some description.')

    expect(getErrorReason(historyStateOf(route))).toEqual({
      error_code: 'flow.invalid',
      details: 'Some details.',
      description: 'Some description.'
    })
  })

  it('carries a reason with only a code', () => {
    expect(getErrorReason(historyStateOf(makeErrorRoute('flow.invalid')))).toEqual({
      error_code: 'flow.invalid'
    })
  })
})

describe('makeMissingStateErrorRoute', () => {
  it('tells the end-user to go back to their application', () => {
    expect(getErrorReason(historyStateOf(makeMissingStateErrorRoute()))).toEqual({
      error_code: 'state.unauthorized',
      details: 'A state issued by the authorization server must be passed as query param.',
      description:
        'You are not authorized to access the page. Please go back to your application and retry to sign-in.'
    })
  })
})

describe('makeUnknownErrorRoute', () => {
  it('tells the end-user to go back to their application', () => {
    expect(getErrorReason(historyStateOf(makeUnknownErrorRoute()))).toEqual({
      error_code: 'unknown',
      details: 'An unexpected error occurred.',
      description:
        'An unexpected error occurred. Please go back to your application and retry to sign-in.'
    })
  })
})

describe('getErrorReason', () => {
  it('returns nothing when the history state carries no reason', () => {
    expect(getErrorReason(undefined)).toBeUndefined()
    expect(getErrorReason({ position: 1 })).toBeUndefined()
  })

  it('returns nothing when the reason has no code', () => {
    expect(getErrorReason({ error: { description: 'Some description.' } })).toBeUndefined()
    expect(getErrorReason({ error: ['flow.invalid'] })).toBeUndefined()
  })

  it('ignores what is not a string', () => {
    expect(getErrorReason({ error: { error_code: 'flow.invalid', details: 42 } })).toEqual({
      error_code: 'flow.invalid'
    })
  })
})
