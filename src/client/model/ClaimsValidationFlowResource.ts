import {
  type ValidationCodeResource,
  validationCodeResourceSchema
} from '@/client/model/ValidationCodeResource'
import type { JSONSchemaType } from 'ajv'
import { type FlowStepResource, flowStepResourceProperties } from '@/client/model/FlowStepResource'

export type ClaimsValidationFlowResource = FlowStepResource & {
  code?: ValidationCodeResource
  redirect_url?: string
}

export const claimValidationFlowResourceSchema: JSONSchemaType<ClaimsValidationFlowResource> = {
  type: 'object',
  properties: {
    code: {
      ...validationCodeResourceSchema,
      nullable: true
    },
    ...flowStepResourceProperties,
    redirect_url: {
      type: ['string'],
      nullable: true
    }
  },
  anyOf: [
    {
      required: ['code']
    },
    {
      required: ['redirect_url']
    }
  ],
  additionalProperties: true
}
