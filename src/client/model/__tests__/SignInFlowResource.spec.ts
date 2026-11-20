import { describe, expect, it } from 'vitest'
import Ajv from 'ajv'
import { signInFlowResourceSchema } from '@/client/model/SignInFlowResource'

describe('signInFlowResourceSchema', () => {
  const validate = new Ajv().compile(signInFlowResourceSchema)

  it('accepts the client and the link leaving the flow', () => {
    expect(
      validate({
        providers: [],
        client: { id: 'acme', display_name: 'Acme Notes' },
        cancel_url: 'https://auth.example.com/api/v1/flow/cancel?state=abc'
      })
    ).toBe(true)
  })

  it('accepts a step without a client nor a link leaving the flow', () => {
    expect(validate({ providers: [] })).toBe(true)
  })

  it('refuses a client without an identifier', () => {
    expect(validate({ providers: [], client: { display_name: 'Acme Notes' } })).toBe(false)
  })
})
