import type { JSONSchemaType } from 'ajv'
import {
  type ClientReferenceResource,
  clientReferenceResourceSchema
} from '@/client/model/ClientReferenceResource'

export type TotpEnrollFlowResource = {
  uri: string
  secret: string
  /** The client the session was started for; absent on a session no client started. */
  client?: ClientReferenceResource
  /** Link leaving the flow; absent where leaving has nowhere to go. */
  cancel_url?: string
}

export const totpEnrollFlowResourceSchema: JSONSchemaType<TotpEnrollFlowResource> = {
  type: 'object',
  properties: {
    uri: { type: 'string' },
    secret: { type: 'string' },
    client: {
      ...clientReferenceResourceSchema,
      nullable: true
    },
    cancel_url: {
      type: 'string',
      nullable: true
    }
  },
  required: ['uri', 'secret'],
  additionalProperties: true
}
