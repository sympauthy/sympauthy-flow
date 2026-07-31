import type { JSONSchemaType } from 'ajv'

export type ConfirmFlowResource = {
  action?: string
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
