import type { JSONSchemaType } from 'ajv'

export type ValidationCodeResource = {
  id: string
  media: string
  reasons: Array<string>
}

export const validationCodeResourceSchema: JSONSchemaType<ValidationCodeResource> = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    media: {
      type: ['string']
    },
    reasons: {
      type: 'array',
      items: {
        type: ['string']
      }
    }
  },
  required: ['id', 'media', 'reasons'],
  additionalProperties: true
}

