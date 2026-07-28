import type { JSONSchemaType } from 'ajv'

/**
 * Password authentication configuration for a flow step.
 *
 * When present on a step resource, that step allows password authentication.
 * A `null` value means the password method is disabled for that step.
 */
export interface PasswordResource {
  identifier_claims: Array<string>
}

export const passwordResourceSchema: JSONSchemaType<PasswordResource> = {
  type: 'object',
  properties: {
    identifier_claims: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  required: ['identifier_claims'],
  additionalProperties: true
}
