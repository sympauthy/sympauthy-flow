import type { JSONSchemaType } from 'ajv'
import type { ClaimType } from '@/client/model/config/ClaimType'
import type { ClaimGroup } from '@/client/model/config/ClaimGroup'

export interface ClaimConfigurationResource {
  id: string,
  name: string,
  type: ClaimType,
  group?: ClaimGroup
}

export const claimConfigurationResourceSchema: JSONSchemaType<ClaimConfigurationResource> = {
  type: 'object',
  properties: {
    'id': {
      type: ['string']
    },
    'name': {
      type: ['string']
    },
    'type': {
      type: ['string'],
      enum: ['string' , 'email' /* FIXME , 'phone_number', 'date' */]
    },
    'group': {
      type: ['string'],
      enum: ['identity', 'address'],
      nullable: true
    }
  },
  required: ['id', 'name', 'type'],
  additionalProperties: true
}
