import type { JSONSchemaType } from 'ajv'

export interface ProviderConfigurationResource {
  id: string
  name: string
  authorize_url: string
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
    },
    'authorize_url': {
      type: ['string']
    }
  },
  required: ['id', 'name']
}
