import type { JSONSchemaType } from 'ajv'

export type PasswordOptionsResource = {
  sign_up_url?: string
  forgotten_password_url?: string
}

export const passwordOptionsResourceSchema: JSONSchemaType<PasswordOptionsResource> = {
  type: 'object',
  properties: {
    sign_up_url: {
      type: ['string'],
      nullable: true
    },
    forgotten_password_url: {
      type: ['string'],
      nullable: true
    }
  }
}
