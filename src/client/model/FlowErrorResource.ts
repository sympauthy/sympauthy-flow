import type { JSONSchemaType } from 'ajv'

export type FlowErrorResource = {
  error_code: string
  details?: string
  description?: string
  redirect_url?: string
}

export const flowErrorResourceSchema: JSONSchemaType<FlowErrorResource> = {
  type: 'object',
  properties: {
    error_code: {
      type: ['string']
    },
    details: {
      type: ['string'],
      nullable: true
    },
    description: {
      type: ['string'],
      nullable: true
    },
    redirect_url: {
      type: ['string'],
      nullable: true
    }
  },
  required: ['error_code'],
  additionalProperties: true
}
