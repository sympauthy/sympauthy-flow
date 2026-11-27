import { describe, expect, it } from 'vitest'
import { formatTechnicalDetails, formatUtcTime } from '@/utils/TechnicalDetailsUtils'

describe('formatUtcTime', () => {
  it('formats the time in UTC, to the second', () => {
    expect(formatUtcTime(new Date('2026-11-13T10:56:12.345+01:00'))).toBe('2026-11-13 09:56:12 UTC')
  })
})

describe('formatTechnicalDetails', () => {
  it('writes one line per detail, as label and value', () => {
    expect(
      formatTechnicalDetails([
        { label: 'Error', value: 'auth.interactive_flow_session.validate.expired' },
        { label: 'Session id', value: '3f2504e0-4f89-11d3-9a0c-0305e82c3301' },
        { label: 'Time', value: '2026-11-13 09:56:12 UTC' }
      ])
    ).toBe(
      'Error: auth.interactive_flow_session.validate.expired\n' +
        'Session id: 3f2504e0-4f89-11d3-9a0c-0305e82c3301\n' +
        'Time: 2026-11-13 09:56:12 UTC'
    )
  })
})
