import { describe, expect, it } from 'vitest'
import type { HistoryState, RouteLocationNamedRaw, RouteLocationNormalized } from 'vue-router'
import {
  getErrorReason,
  getErrorState,
  getStateQueryParam,
  makeApiErrorRoute,
  makeErrorReason,
  makeErrorRoute,
  makeMissingStateErrorRoute,
  makeUnknownErrorRoute
} from '@/router'
import { ErrorApiResponse } from '@/client/ErrorApiResponse'

function historyStateOf(route: unknown): HistoryState | undefined {
  return (route as RouteLocationNamedRaw).state
}

function routeWithQuery(query: RouteLocationNormalized['query']): RouteLocationNormalized {
  return { query } as RouteLocationNormalized
}

describe('getStateQueryParam', () => {
  it('returns the state the route carries', () => {
    expect(getStateQueryParam(routeWithQuery({ state: 'abc' }))).toBe('abc')
    expect(getStateQueryParam(routeWithQuery({ state: ['abc', 'def'] }))).toBe('abc')
  })

  it('returns nothing for a missing, empty or blank state', () => {
    expect(getStateQueryParam(routeWithQuery({}))).toBeUndefined()
    expect(getStateQueryParam(routeWithQuery({ state: '' }))).toBeUndefined()
    expect(getStateQueryParam(routeWithQuery({ state: ' ' }))).toBeUndefined()
    expect(getStateQueryParam(routeWithQuery({ state: [null] }))).toBeUndefined()
  })
})

describe('makeErrorReason', () => {
  it('leaves out details and a description that say nothing', () => {
    expect(makeErrorReason('flow.invalid', '', null)).toEqual({ error_code: 'flow.invalid' })
  })
})

describe('makeErrorRoute', () => {
  const reason = makeErrorReason('flow.invalid', 'Some details.', 'Some description.')

  it('leads to the error page without putting the reason nor the state in the query', () => {
    const route = makeErrorRoute(reason, 'abc')

    expect(route).toMatchObject({ name: 'Error' })
    expect((route as RouteLocationNamedRaw).query).toBeUndefined()
  })

  it('carries a reason and a state the error page reads back', () => {
    const route = makeErrorRoute(reason, 'abc')

    expect(getErrorReason(historyStateOf(route))).toEqual({
      error_code: 'flow.invalid',
      details: 'Some details.',
      description: 'Some description.'
    })
    expect(getErrorState(historyStateOf(route))).toBe('abc')
  })

  it('carries a reason with only a code', () => {
    expect(
      getErrorReason(historyStateOf(makeErrorRoute(makeErrorReason('flow.invalid'), 'abc')))
    ).toEqual({ error_code: 'flow.invalid' })
  })

  it('carries no state when the page was opened with none', () => {
    expect(getErrorState(historyStateOf(makeErrorRoute(reason)))).toBeUndefined()
  })

  it('clears the state of the entry it replaces when the page was opened with none', () => {
    // A replace writes the new entry over the history state of the one it replaces.
    const replaced = { ...{ state: 'stale' }, ...historyStateOf(makeErrorRoute(reason)) }

    expect(getErrorState(replaced)).toBeUndefined()
  })
})

describe('makeApiErrorRoute', () => {
  it("carries the server's details and description", () => {
    const response = new ErrorApiResponse('flow.invalid', 'Some details.', 'Some description.', {
      error_code: 'flow.invalid',
      details: 'Some details.',
      description: 'Some description.'
    })

    expect(getErrorReason(historyStateOf(makeApiErrorRoute('abc', response)))).toEqual({
      error_code: 'flow.invalid',
      details: 'Some details.',
      description: 'Some description.'
    })
  })

  it("leaves out the flow's stand-in for details the server did not send", () => {
    const response = new ErrorApiResponse('api.unknown', 'An unknown error occurred.')

    expect(getErrorReason(historyStateOf(makeApiErrorRoute('abc', response)))).toEqual({
      error_code: 'api.unknown'
    })
  })
})

describe('makeMissingStateErrorRoute', () => {
  it('carries only the code, and no state', () => {
    const route = makeMissingStateErrorRoute()

    expect(getErrorReason(historyStateOf(route))).toEqual({ error_code: 'state.unauthorized' })
    expect(getErrorState(historyStateOf(route))).toBeUndefined()
  })
})

describe('makeUnknownErrorRoute', () => {
  it('carries only the code, and the state', () => {
    const route = makeUnknownErrorRoute('abc')

    expect(getErrorReason(historyStateOf(route))).toEqual({ error_code: 'unknown' })
    expect(getErrorState(historyStateOf(route))).toBe('abc')
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

describe('getErrorState', () => {
  it('returns nothing for a state that is not a string, or is empty', () => {
    expect(getErrorState(undefined)).toBeUndefined()
    expect(getErrorState({ state: 42 })).toBeUndefined()
    expect(getErrorState({ state: '' })).toBeUndefined()
  })
})
