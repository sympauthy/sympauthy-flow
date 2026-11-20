import type { JSONSchemaType } from 'ajv'
import { type FlowStepResource, flowStepResourceProperties } from '@/client/model/FlowStepResource'

/**
 * Why the session failed, or only a `redirect_url` to send the browser to instead, without any other
 * field, `error_code` included.
 */
export type FlowErrorResource = FlowStepResource & {
  error_code?: string
  details?: string
  description?: string
  redirect_url?: string
}

export const flowErrorResourceSchema: JSONSchemaType<FlowErrorResource> = {
  type: 'object',
  properties: {
    ...flowStepResourceProperties,
    error_code: {
      type: ['string'],
      nullable: true
    },
    details: {
      type: ['string'],
      nullable: true
    },
    description: {
      type: ['string'],
      nullable: true
    },
    redirect_url: {
      type: ['string'],
      nullable: true
    }
  },
  required: [],
  additionalProperties: true
}
