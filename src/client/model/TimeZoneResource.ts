import type { JSONSchemaType } from 'ajv'

export interface TimeZoneResource {
  id: string
  offset: string
}

export const timeZoneResourceSchema: JSONSchemaType<TimeZoneResource> = {
  type: 'object',
  properties: {
    id: {
      type: ['string']
    },
    offset: {
      type: ['string']
    }
  },
  required: ['id', 'offset'],
  additionalProperties: true
}