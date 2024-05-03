import type { JSONSchemaType } from 'ajv'
import type { ClaimType } from '@/client/model/config/ClaimType'
import type { ClaimGroup } from '@/client/model/config/ClaimGroup'

export interface ClaimConfigurationResource {
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
      enum: ['string', 'email' /* FIXME , 'phone_number', 'date' */]
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
