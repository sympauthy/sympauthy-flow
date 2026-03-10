import type { JSONSchemaType } from 'ajv'

export interface PasswordConfigurationResource {
  identifier_claims?: Array<string>
}

export const passwordConfigurationResourceSchema: JSONSchemaType<PasswordConfigurationResource> = {
  type: 'object',
  properties: {
    identifier_claims: {
      type: 'array',
      items: {
        type: 'string'
      },
      nullable: true
    }
  },
  additionalProperties: true
}
