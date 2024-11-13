import { type ValidationCodeResource, validationCodeResourceSchema } from '@/client/model/ValidationCodeResource'
import type { JSONSchemaType } from 'ajv'

export type ClaimsValidationFlowResultResource = {
  code?: ValidationCodeResource
  redirect_url?: string
}

export const claimValidationFlowResultResourceSchema: JSONSchemaType<ClaimsValidationFlowResultResource> = {
  type: 'object',
  properties: {
    code: {
      ...validationCodeResourceSchema,
      nullable: true
    },
    redirect_url: {
      type: ['string'],
      nullable: true
    }
  },
  anyOf: [
    {
      required: ['code'],
    },
    {
      required: ['redirect_url'],
    }
  ],
  additionalProperties: true
}
