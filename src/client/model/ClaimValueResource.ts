import type { JSONSchemaType } from 'ajv'

export type ClaimValueResource = {
  claim: string
  collected: boolean
  value?: string // FIXME add other supported types
  suggested_value?: string // FIXME add other supported types
}

export const claimValueResourceSchema: JSONSchemaType<ClaimValueResource> = {
  type: 'object',
  properties: {
    claim: {
      type: ['string']
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
  required: ['claim', 'collected'],
  additionalProperties: true
}
