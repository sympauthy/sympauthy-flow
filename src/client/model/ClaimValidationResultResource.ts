import { type ValidationCodeResource, validationCodeResourceSchema } from '@/client/model/ValidationCodeResource'
import type { JSONSchemaType } from 'ajv'

export type ClaimValidationResultResource = {
  codes: Array<ValidationCodeResource>
  redirect_url?: string
}

export const claimValidationResultResourceSchema: JSONSchemaType<ClaimValidationResultResource> = {
  type: 'object',
  properties: {
    codes: {
      type: 'array',
      items: {
        ...validationCodeResourceSchema
      }
    },
    redirect_url: {
      type: ['string'],
      nullable: true
    }
  },
  required: ['codes'],
  additionalProperties: true
}
