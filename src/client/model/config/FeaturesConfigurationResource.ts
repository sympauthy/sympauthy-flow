import type { JSONSchemaType } from 'ajv'

export interface FeaturesConfigurationResource {}

export const featuresConfigurationResourceSchema: JSONSchemaType<FeaturesConfigurationResource> = {
  type: 'object',
  additionalProperties: true
}
