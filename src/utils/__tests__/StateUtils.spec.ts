import { describe, expect, it } from 'vitest'
import { getSessionId } from '@/utils/StateUtils'

function base64Url(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function makeState(payload: unknown): string {
  return `${base64Url('{"alg":"HS256"}')}.${base64Url(JSON.stringify(payload))}.signature`
}

describe('getSessionId', () => {
  it('returns the subject of the state', () => {
    expect(getSessionId(makeState({ sub: '3f2504e0-4f89-11d3-9a0c-0305e82c3301' }))).toBe(
      '3f2504e0-4f89-11d3-9a0c-0305e82c3301'
    )
  })

  it('returns a subject written in capitals', () => {
    expect(getSessionId(makeState({ sub: '3F2504E0-4F89-11D3-9A0C-0305E82C3301' }))).toBe(
      '3F2504E0-4F89-11D3-9A0C-0305E82C3301'
    )
  })

  it('reads a payload whose encoding has no padding and uses the URL alphabet', () => {
    // "??>" encodes to "Pz8-", which the standard alphabet writes "Pz8+".
    const state = makeState({ sub: '3f2504e0-4f89-11d3-9a0c-0305e82c3301', x: '??>', y: 'a' })

    expect(state.split('.')[1]).toContain('-')
    expect(getSessionId(state)).toBe('3f2504e0-4f89-11d3-9a0c-0305e82c3301')
  })

  it('returns nothing for a subject that is not a UUID', () => {
    expect(getSessionId(makeState({ sub: 'Call +1 555 0100 to unlock your account' }))).toBe(
      undefined
    )
    expect(getSessionId(makeState({ sub: '3f2504e0-4f89-11d3-9a0c-0305e82c3301 ' }))).toBe(
      undefined
    )
    expect(getSessionId(makeState({ sub: 42 }))).toBeUndefined()
    expect(getSessionId(makeState({}))).toBeUndefined()
  })

  it('returns nothing for a state that is not a token', () => {
    expect(getSessionId('abc')).toBeUndefined()
    expect(getSessionId('a.b.c')).toBeUndefined()
    expect(getSessionId(`a.${base64Url('[]')}.c`)).toBeUndefined()
    expect(getSessionId(`a.${base64Url('null')}.c`)).toBeUndefined()
  })
})
