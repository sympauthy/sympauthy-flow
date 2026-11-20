import { describe, expect, it } from 'vitest'
import Ajv from 'ajv'
import { flowErrorResourceSchema } from '@/client/model/FlowErrorResource'

describe('flowErrorResourceSchema', () => {
  const validate = new Ajv().compile(flowErrorResourceSchema)

  it('accepts the client and the link leaving the flow', () => {
    expect(
      validate({
        error_code: 'auth.interactive_flow_session.expired',
        description: 'Your sign-in has expired.',
        client: { id: 'acme', display_name: 'Acme Notes' },
        cancel_url: 'https://auth.example.com/api/v1/flow/cancel?state=abc'
      })
    ).toBe(true)
  })

  it('accepts a failure without a client nor a link leaving the flow', () => {
    expect(validate({ error_code: 'auth.interactive_flow_session.expired' })).toBe(true)
  })

  it('refuses a client without an identifier', () => {
    expect(
      validate({
        error_code: 'auth.interactive_flow_session.expired',
        client: { display_name: 'Acme Notes' }
      })
    ).toBe(false)
  })
})
