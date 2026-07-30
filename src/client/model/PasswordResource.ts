import type { JSONSchemaType } from 'ajv'
import type { CollectableClaimResource } from '@/client/model/CollectableClaimResource'
import { collectableClaimResourceSchema } from '@/client/model/CollectableClaimResource'

/**
 * Password authentication configuration for a flow step.
 *
 * When present on a step resource, that step allows password authentication.
 * A `null` value means the password method is disabled for that step.
 */
export interface PasswordResource {
  /**
   * Claims that uniquely identify a user. Used as the login during sign-in and
   * as the required claims collected during sign-up.
   */
  identifier_claims: Array<CollectableClaimResource>
}

export const passwordResourceSchema: JSONSchemaType<PasswordResource> = {
  type: 'object',
  properties: {
    identifier_claims: {
      type: 'array',
      items: {
        ...collectableClaimResourceSchema
      }
    }
  },
  required: ['identifier_claims'],
  additionalProperties: true
}
