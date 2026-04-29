import type { JSONSchemaType } from 'ajv'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FeaturesConfigurationResource {}

export const featuresConfigurationResourceSchema: JSONSchemaType<FeaturesConfigurationResource> = {
  type: 'object',
  additionalProperties: true
}
