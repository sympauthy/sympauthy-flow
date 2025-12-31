import { type ValidationCodeResource, validationCodeResourceSchema } from '@/client/model/ValidationCodeResource.ts'
import type { JSONSchemaType } from 'ajv'

export type ResendClaimsValidationCodeResultResource = {
  media: string
  resent: boolean
  code?: ValidationCodeResource
}

export const resendClaimsValidationCodeResultResourceSchema: JSONSchemaType<ResendClaimsValidationCodeResultResource> = {
  type: 'object',
  properties: {
    media: {
      type: 'string'
    },
    resent: {
      type: 'boolean'
    },
    code: {
      ...validationCodeResourceSchema,
      nullable: true
    }
  },
  required: ['media', 'resent'],
  additionalProperties: true
}
