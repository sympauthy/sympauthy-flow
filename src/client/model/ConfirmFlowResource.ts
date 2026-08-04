import type { JSONSchemaType } from 'ajv'

export type ConfirmFlowResource = {
  action?: string
  requires_reauthentication?: boolean
  initiating_client_id?: string
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
    initiating_client_id: {
      type: 'string',
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
