import type { JSONSchemaType } from 'ajv'
import type { FeaturesResource } from '@/client/model/FeaturesResource'
import { featuresResourceSchema } from '@/client/model/FeaturesResource'
import type { ProviderConfigurationResource } from '@/client/model/ProviderConfigurationResource'
import { providerConfigurationResourceSchema } from '@/client/model/ProviderConfigurationResource'

export interface ConfigurationResource {
  features: FeaturesResource,
  providers: Array<ProviderConfigurationResource>
}

export const configurationResourceSchema: JSONSchemaType<ConfigurationResource> = {
  type: 'object',
  additionalProperties: true,
  properties: {
    'features': {
      ...featuresResourceSchema
    },
    'providers': {
      type: 'array',
      items: {
        ...providerConfigurationResourceSchema
      }
    }
  },
  required: ['features', 'providers']
}
