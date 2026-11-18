import { describe, expect, it } from 'vitest'
import { or } from '@/utils/StringUtils'
import { i18n } from '@/i18n'

describe('or', () => {
  it('returns an empty string when there is no value', () => {
    expect(or(i18n, [])).toBe('')
  })

  it('returns the value alone when there is one', () => {
    expect(or(i18n, ['Email'])).toBe('Email')
  })

  it('joins two values with "or"', () => {
    expect(or(i18n, ['Email', 'Username'])).toBe('Email or Username')
  })

  it('joins every value but the last with the separator, and the last with "or"', () => {
    expect(or(i18n, ['Email', 'Username', 'Phone number'])).toBe('Email, Username or Phone number')
    expect(or(i18n, ['A', 'B', 'C', 'D'])).toBe('A, B, C or D')
  })
})
