import type { CollectedClaimConfigurationResource } from '@/client/model/config/CollectedClaimConfigurationResource'
import type { JSONSchemaType } from 'ajv'

export interface PasswordConfigurationResource {
  sign_up_claims?: Array<CollectedClaimConfigurationResource>
}

export const passwordConfigurationResourceSchema: JSONSchemaType<PasswordConfigurationResource> = {
  type: 'object',
  properties: {
    'sign_up_claims': {
      type: ['array'],
      nullable: true
    }
  },
  additionalProperties: true
}
