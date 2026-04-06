import type { JSONSchemaType } from 'ajv'
import type { ClaimType } from '@/client/model/config/ClaimType'
import type { ClaimGroup } from '@/client/model/config/ClaimGroup'
import type { ClaimConfiguration } from '@/client/model/ClaimConfiguration'

export type ClaimValueResource = ClaimConfiguration & {
  collected: boolean
  value?: string
  suggested_value?: string
}

export const claimValueResourceSchema: JSONSchemaType<ClaimValueResource> = {
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
      enum: ['email', 'string', 'timezone', 'date', 'phone_number']
    },
    group: {
      type: ['string'],
      enum: ['identity', 'address'],
      nullable: true
    },
    collected: {
      type: ['boolean']
    },
    value: {
      type: ['string'],
      nullable: true
    },
    suggested_value: {
      type: ['string'],
      nullable: true
    }
  },
  required: ['id', 'required', 'name', 'type', 'collected'],
  additionalProperties: true
}
