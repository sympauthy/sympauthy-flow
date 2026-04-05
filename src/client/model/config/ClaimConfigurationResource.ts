import type { JSONSchemaType } from 'ajv'
import type { ClaimType } from '@/client/model/config/ClaimType'
import type { ClaimGroup } from '@/client/model/config/ClaimGroup'
import type { ClaimConfiguration } from '@/client/model/ClaimConfiguration'

export interface ClaimConfigurationResource extends ClaimConfiguration {
  id: string
  required: boolean
  name: string
  type: ClaimType
  group?: ClaimGroup
}

export const claimConfigurationResourceSchema: JSONSchemaType<ClaimConfigurationResource> = {
  type: 'object',
  properties: {
    id: {
      type: ['string']
    },
    required: {
      type: ['boolean']
    },
    name: {
      type: ['string']
    },
    type: {
      type: ['string'],
      enum: ['email', 'string', 'timezone', 'date' /* FIXME , 'phone_number' */]
    },
    group: {
      type: ['string'],
      enum: ['identity', 'address'],
      nullable: true
    }
  },
  required: ['id', 'required', 'name', 'type'],
  additionalProperties: true
}
