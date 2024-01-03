import type { JSONSchemaType } from 'ajv'

export interface FeaturesResource {

}

export const featuresResourceSchema: JSONSchemaType<FeaturesResource> = {
  type: 'object',
  additionalProperties: true
}
