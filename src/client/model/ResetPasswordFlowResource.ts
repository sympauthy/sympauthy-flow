import type { JSONSchemaType } from 'ajv'
import {
  type CollectableClaimResource,
  collectableClaimResourceSchema
} from '@/client/model/CollectableClaimResource'

/**
 * Configuration of the step where the end-user asks for a code to reset a forgotten password.
 *
 * The resource returns EITHER the identifier claims OR a `redirect_url` to send the browser to
 * instead, once the end-user is signed in. Consumers must check `redirect_url` first.
 */
export type ResetPasswordFlowResource = {
  /** Identifier claims: the value of any one of them is the login whose password is reset. */
  identifier_claims?: Array<CollectableClaimResource>
  redirect_url?: string
}

export const resetPasswordFlowResourceSchema: JSONSchemaType<ResetPasswordFlowResource> = {
  type: 'object',
  properties: {
    identifier_claims: {
      type: 'array',
      items: {
        ...collectableClaimResourceSchema
      },
      nullable: true
    },
    redirect_url: {
      type: 'string',
      nullable: true
    }
  },
  anyOf: [
    {
      required: ['identifier_claims']
    },
    {
      required: ['redirect_url']
    }
  ],
  additionalProperties: true
}
