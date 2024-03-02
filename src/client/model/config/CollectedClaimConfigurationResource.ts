import type { JSONSchemaType } from 'ajv'

export interface CollectedClaimConfigurationResource {
  id: string
  index: number
  required: boolean
}

export const collectedClaimConfigurationResourceSchema: JSONSchemaType<CollectedClaimConfigurationResource> =
  {
    type: 'object',
    properties: {
      id: {
        type: ['string']
      },
      index: {
        type: ['number']
      },
      required: {
        type: ['boolean']
      }
    },
    required: ['id', 'index', 'required'],
    additionalProperties: true
  }
