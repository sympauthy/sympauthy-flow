import type { JSONSchemaType } from 'ajv'

export interface SignInResultResource {
  redirect_url: string
}

export const signInResultResourceSchema: JSONSchemaType<SignInResultResource> = {
  type: 'object',
  properties: {
    'redirect_url': {
      type: ['string']
    }
  },
  required: ['redirect_url']
}
