import type { JSONSchemaType } from 'ajv'

export interface SignUpResultResource {
  redirect_url: string
}

export const signUpResultResourceSchema: JSONSchemaType<SignUpResultResource> = {
  type: 'object',
  properties: {
    redirect_url: {
      type: ['string']
    }
  },
  required: ['redirect_url']
}
