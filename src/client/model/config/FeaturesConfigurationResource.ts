import type { JSONSchemaType } from 'ajv'

export interface FeaturesConfigurationResource {
  sign_up_enabled?: boolean
  invitation_enabled?: boolean
}

export const featuresConfigurationResourceSchema: JSONSchemaType<FeaturesConfigurationResource> = {
  type: 'object',
  properties: {
    sign_up_enabled: { type: 'boolean', nullable: true },
    invitation_enabled: { type: 'boolean', nullable: true }
  },
  additionalProperties: true
}
