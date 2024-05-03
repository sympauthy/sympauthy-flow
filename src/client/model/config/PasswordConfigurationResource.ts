import type { JSONSchemaType } from 'ajv'

export interface PasswordConfigurationResource {
  login_claims?: Array<string>
  sign_up_claims?: Array<string>
}

export const passwordConfigurationResourceSchema: JSONSchemaType<PasswordConfigurationResource> = {
  type: 'object',
  properties: {
    login_claims: {
      type: 'array',
      items: {
        type: 'string'
      },
      nullable: true
    },
    sign_up_claims: {
      type: 'array',
      items: {
        type: 'string'
      },
      nullable: true
    }
  },
  additionalProperties: true
}
