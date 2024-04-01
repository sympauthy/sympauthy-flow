import type { CollectedClaimConfigurationResource } from '@/client/model/config/CollectedClaimConfigurationResource'
import type { JSONSchemaType } from 'ajv'
import { collectedClaimConfigurationResourceSchema } from '@/client/model/config/CollectedClaimConfigurationResource'

export interface PasswordConfigurationResource {
  login_claims?: Array<string>
  sign_up_claims?: Array<CollectedClaimConfigurationResource>
}

export const passwordConfigurationResourceSchema: JSONSchemaType<PasswordConfigurationResource> = {
  type: 'object',
  properties: {
    login_claims: {
      type: 'array',
      items: {
        type: 'string'
      },
      nullable: true
    },
    sign_up_claims: {
      type: 'array',
      items: {
        ...collectedClaimConfigurationResourceSchema
      },
      nullable: true
    }
  },
  additionalProperties: true
}
