import type { JSONSchemaType } from 'ajv'
import type { FeaturesResource } from '@/client/model/FeaturesResource'
import { featuresResourceSchema } from '@/client/model/FeaturesResource'

export interface ConfigurationResource {
  features: FeaturesResource
}

export const configurationResourceSchema: JSONSchemaType<ConfigurationResource> = {
  type: 'object',
  properties: {
    'features': {
      ...featuresResourceSchema
    }
  },
  required: ['features'],
  additionalProperties: true
}
