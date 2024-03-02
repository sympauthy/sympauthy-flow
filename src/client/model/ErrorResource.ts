import type { JSONSchemaType } from 'ajv'

export interface ErrorResource {
  error_code: string
  details?: string
  description?: string
}

export const errorResourceSchema: JSONSchemaType<ErrorResource> = {
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
    }
  },
  required: ['error_code'],
  additionalProperties: true
}
