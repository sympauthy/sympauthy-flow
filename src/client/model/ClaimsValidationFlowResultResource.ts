import { type ValidationCodeResource, validationCodeResourceSchema } from '@/client/model/ValidationCodeResource'
import type { JSONSchemaType } from 'ajv'

export type ClaimsValidationFlowResultResource = {
  codes?: Array<ValidationCodeResource>
  redirect_url?: string
}

export const claimValidationFlowResultResourceSchema: JSONSchemaType<ClaimsValidationFlowResultResource> = {
  type: 'object',
  properties: {
    codes: {
      type: 'array',
      items: {
        ...validationCodeResourceSchema
      },
      nullable: true
    },
    redirect_url: {
      type: ['string'],
      nullable: true
    }
  },
  anyOf: [
    {
      required: ['codes'],
    },
    {
      required: ['redirect_url'],
    }
  ],
  additionalProperties: true
}
