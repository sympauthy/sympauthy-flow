import type { JSONSchemaType } from 'ajv'
import {
  type ClientReferenceResource,
  clientReferenceResourceSchema
} from '@/client/model/ClientReferenceResource'

export type MfaMethodResource = {
  method: string
  redirect_url: string
}

export type MfaFlowResource = {
  /** The client the session was started for; absent on a session no client started. */
  client?: ClientReferenceResource
  /** Link leaving the flow; absent where leaving has nowhere to go. */
  cancel_url?: string
  redirect_url?: string
  methods?: MfaMethodResource[]
  skip_redirect_url?: string
}

const mfaMethodResourceSchema: JSONSchemaType<MfaMethodResource> = {
  type: 'object',
  properties: {
    method: { type: 'string' },
    redirect_url: { type: 'string' }
  },
  required: ['method', 'redirect_url'],
  additionalProperties: true
}

export const mfaFlowResourceSchema: JSONSchemaType<MfaFlowResource> = {
  type: 'object',
  properties: {
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
    },
    methods: {
      type: 'array',
      items: { ...mfaMethodResourceSchema },
      nullable: true
    },
    skip_redirect_url: {
      type: 'string',
      nullable: true
    }
  },
  anyOf: [{ required: ['redirect_url'] }, { required: ['methods'] }],
  additionalProperties: true
}
