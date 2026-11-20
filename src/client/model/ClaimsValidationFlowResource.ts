import {
  type ValidationCodeResource,
  validationCodeResourceSchema
} from '@/client/model/ValidationCodeResource'
import type { JSONSchemaType } from 'ajv'
import {
  type ClientReferenceResource,
  clientReferenceResourceSchema
} from '@/client/model/ClientReferenceResource'

export type ClaimsValidationFlowResource = {
  code?: ValidationCodeResource
  /** The client the session was started for; absent on a session no client started. */
  client?: ClientReferenceResource
  /** Link leaving the flow; absent where leaving has nowhere to go. */
  cancel_url?: string
  redirect_url?: string
}

export const claimValidationFlowResourceSchema: JSONSchemaType<ClaimsValidationFlowResource> = {
  type: 'object',
  properties: {
    code: {
      ...validationCodeResourceSchema,
      nullable: true
    },
    client: {
      ...clientReferenceResourceSchema,
      nullable: true
    },
    cancel_url: {
      type: 'string',
      nullable: true
    },
    redirect_url: {
      type: ['string'],
      nullable: true
    }
  },
  anyOf: [
    {
      required: ['code']
    },
    {
      required: ['redirect_url']
    }
  ],
  additionalProperties: true
}
