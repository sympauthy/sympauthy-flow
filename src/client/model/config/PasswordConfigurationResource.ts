import type { CollectedClaimConfigurationResource } from '@/client/model/config/CollectedClaimConfigurationResource'
import type { JSONSchemaType } from 'ajv'
import { collectedClaimConfigurationResourceSchema } from '@/client/model/config/CollectedClaimConfigurationResource'

export interface PasswordConfigurationResource {
  sign_up_claims?: Array<CollectedClaimConfigurationResource>
}

export const passwordConfigurationResourceSchema: JSONSchemaType<PasswordConfigurationResource> = {
  type: 'object',
  properties: {
    'sign_up_claims': {
      type: 'array',
      items: {
        ...collectedClaimConfigurationResourceSchema
      },
      nullable: true
    }
  },
  additionalProperties: true
}
