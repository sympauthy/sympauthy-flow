import type { JSONSchemaType } from 'ajv'
import { type FlowStepResource, flowStepResourceProperties } from '@/client/model/FlowStepResource'

export type TotpEnrollFlowResource = FlowStepResource & {
  uri: string
  secret: string
}

export const totpEnrollFlowResourceSchema: JSONSchemaType<TotpEnrollFlowResource> = {
  type: 'object',
  properties: {
    uri: { type: 'string' },
    secret: { type: 'string' },
    ...flowStepResourceProperties
  },
  required: ['uri', 'secret'],
  additionalProperties: true
}
