import type { JSONSchemaType } from 'ajv'

export type FlowResource = {
  redirect_url: string
}

export const flowResultResourceSchema: JSONSchemaType<FlowResource> = {
  type: 'object',
  properties: {
    redirect_url: {
      type: ['string']
    }
  },
  required: ['redirect_url']
}
