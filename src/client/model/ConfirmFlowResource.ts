import type { JSONSchemaType } from 'ajv'
import {
  type ClientReferenceResource,
  clientReferenceResourceSchema
} from '@/client/model/ClientReferenceResource'

export type ConfirmFlowResource = {
  action?: string
  requires_reauthentication?: boolean
  client?: ClientReferenceResource
  redirect_url?: string
}

export const confirmFlowResourceSchema: JSONSchemaType<ConfirmFlowResource> = {
  type: 'object',
  properties: {
    action: {
      type: 'string',
      nullable: true
    },
    requires_reauthentication: {
      type: 'boolean',
      nullable: true
    },
    client: {
      ...clientReferenceResourceSchema,
      nullable: true
    },
    redirect_url: {
      type: 'string',
      nullable: true
    }
  },
  anyOf: [{ required: ['redirect_url'] }, { required: ['action'] }],
  additionalProperties: true
}
