import type { JSONSchemaType } from 'ajv'

export interface FlowResultResource {
  redirect_url: string
}

export const flowResultResourceSchema: JSONSchemaType<FlowResultResource> = {
  type: 'object',
  properties: {
    redirect_url: {
      type: ['string']
    }
  },
  required: ['redirect_url']
}
