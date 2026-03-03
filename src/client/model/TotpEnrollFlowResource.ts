import type { JSONSchemaType } from 'ajv'

export type TotpEnrollFlowResource = {
  uri: string
  secret: string
}

export const totpEnrollFlowResourceSchema: JSONSchemaType<TotpEnrollFlowResource> = {
  type: 'object',
  properties: {
    uri: { type: 'string' },
    secret: { type: 'string' }
  },
  required: ['uri', 'secret'],
  additionalProperties: true
}
