import type { JSONSchemaType } from 'ajv'

export interface MfaConfigurationResource {
  totp: boolean
}

export const mfaConfigurationResourceSchema: JSONSchemaType<MfaConfigurationResource> = {
  type: 'object',
  properties: {
    totp: { type: 'boolean' }
  },
  required: ['totp'],
  additionalProperties: true
}
