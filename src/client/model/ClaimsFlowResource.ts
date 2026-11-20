import type { ClaimValueResource } from '@/client/model/ClaimValueResource'
import type { JSONSchemaType } from 'ajv'
import {
  type ClientReferenceResource,
  clientReferenceResourceSchema
} from '@/client/model/ClientReferenceResource'
import { claimValueResourceSchema } from '@/client/model/ClaimValueResource'

export type ClaimsFlowResource = {
  claims?: Array<ClaimValueResource>
  /** The client the session was started for; absent on a session no client started. */
  client?: ClientReferenceResource
  /** Link leaving the flow; absent where leaving has nowhere to go. */
  cancel_url?: string
  redirect_url?: string
}

export const claimsFlowResourceSchema: JSONSchemaType<ClaimsFlowResource> = {
  type: 'object',
  properties: {
    claims: {
      type: 'array',
      nullable: true,
      items: {
        ...claimValueResourceSchema
      }
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
      type: 'string',
      nullable: true
    }
  },
  oneOf: [{ required: ['claims'] }, { required: ['redirect_url'] }],
  additionalProperties: true
}
