import type { ClaimValueResource } from '@/client/model/ClaimValueResource'
import type { JSONSchemaType } from 'ajv'
import { claimValueResourceSchema } from '@/client/model/ClaimValueResource'

export type ClaimsFlowResource = {
  claims?: Array<ClaimValueResource>
  redirect_url?: string
}

export const claimsFlowResourceSchema: JSONSchemaType<ClaimsFlowResource> = {
  type: 'object',
  properties: {
    claims: {
      type: 'array',
      nullable: true,
      items: {
        ...claimValueResourceSchema
      }
    },
    redirect_url: {
      type: 'string',
      nullable: true
    }
  },
  oneOf: [
    { required: ['claims'] },
    { required: ['redirect_url'] }
  ],
  additionalProperties: true
}
