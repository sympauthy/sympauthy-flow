import type { JSONSchemaType } from 'ajv'

export interface ProviderConfigurationResource {
  id: string
  name: string
}

export const providerConfigurationResourceSchema: JSONSchemaType<ProviderConfigurationResource> = {
  type: 'object',
  additionalProperties: true,
  properties: {
    'id': {
      type: ['string']
    },
    'name': {
      type: ['string']
    }
  },
  required: ['id', 'name']
}
