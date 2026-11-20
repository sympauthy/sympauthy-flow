import type { JSONSchemaType } from 'ajv'
import { type FlowStepResource, flowStepResourceProperties } from '@/client/model/FlowStepResource'

export type MfaMethodResource = {
  method: string
  redirect_url: string
}

export type MfaFlowResource = FlowStepResource & {
  redirect_url?: string
  methods?: MfaMethodResource[]
  skip_redirect_url?: string
}

const mfaMethodResourceSchema: JSONSchemaType<MfaMethodResource> = {
  type: 'object',
  properties: {
    method: { type: 'string' },
    redirect_url: { type: 'string' }
  },
  required: ['method', 'redirect_url'],
  additionalProperties: true
}

export const mfaFlowResourceSchema: JSONSchemaType<MfaFlowResource> = {
  type: 'object',
  properties: {
    ...flowStepResourceProperties,
    redirect_url: {
      type: 'string',
      nullable: true
    },
    methods: {
      type: 'array',
      items: { ...mfaMethodResourceSchema },
      nullable: true
    },
    skip_redirect_url: {
      type: 'string',
      nullable: true
    }
  },
  anyOf: [{ required: ['redirect_url'] }, { required: ['methods'] }],
  additionalProperties: true
}
