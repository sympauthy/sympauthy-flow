import type { JSONSchemaType } from 'ajv'
import { type ValidationCodeResource, validationCodeResourceSchema } from '@/client/model/ValidationCodeResource'

export type ClaimsValidationResource = {
  codes: Array<ValidationCodeResource>
}

export const claimsValidationResourceSchema: JSONSchemaType<ClaimsValidationResource> = {
  type: 'object',
  properties: {
    codes: {
      type: 'array',
      items: {
        ...validationCodeResourceSchema
      }
    }
  },
  required: ['codes'],
  additionalProperties: true
}
