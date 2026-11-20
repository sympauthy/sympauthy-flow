import { describe, expect, it } from 'vitest'
import Ajv from 'ajv'
import { confirmFlowResourceSchema } from '@/client/model/ConfirmFlowResource'
import { getClientName } from '@/client/model/ClientReferenceResource'

describe('confirmFlowResourceSchema', () => {
  const validate = new Ajv().compile(confirmFlowResourceSchema)

  it('accepts an action a client started, with the client', () => {
    expect(
      validate({
        action: 'enroll_mfa',
        requires_reauthentication: false,
        client: { id: 'example', display_name: 'Example' }
      })
    ).toBe(true)
  })

  it('accepts a client without a display name', () => {
    expect(validate({ action: 'enroll_mfa', client: { id: 'example' } })).toBe(true)
  })

  it('accepts an action an administrator started, without a client', () => {
    expect(validate({ action: 'link_provider' })).toBe(true)
  })

  it('refuses a client without an identifier', () => {
    expect(validate({ action: 'enroll_mfa', client: { display_name: 'Example' } })).toBe(false)
  })
})

describe('getClientName', () => {
  it('returns the display name the deployment gives the client', () => {
    expect(getClientName({ id: 'example', display_name: 'Example' })).toBe('Example')
  })

  it('returns the identifier when the client has no display name', () => {
    expect(getClientName({ id: 'example' })).toBe('example')
  })
})
