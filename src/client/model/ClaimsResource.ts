import type { ClaimValueResource } from '@/client/model/ClaimValueResource'
import type { JSONSchemaType } from 'ajv'
import { claimValueResourceSchema } from '@/client/model/ClaimValueResource'

export type ClaimsResource = {
  claims: Array<ClaimValueResource>
}

export const claimsResourceSchema: JSONSchemaType<ClaimsResource> = {
  type: 'object',
  properties: {
    claims: {
      type: 'array',
      items: {
        ...claimValueResourceSchema
      }
    }
  },
  required: ['claims'],
  additionalProperties: true
}
