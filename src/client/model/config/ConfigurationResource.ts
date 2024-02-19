import type { JSONSchemaType } from 'ajv'
import type { FeaturesConfigurationResource } from '@/client/model/config/FeaturesConfigurationResource'
import { featuresConfigurationResourceSchema } from '@/client/model/config/FeaturesConfigurationResource'
import type { ProviderConfigurationResource } from '@/client/model/config/ProviderConfigurationResource'
import { providerConfigurationResourceSchema } from '@/client/model/config/ProviderConfigurationResource'
import type { ClaimConfigurationResource } from '@/client/model/config/ClaimConfigurationResource'
import { claimConfigurationResourceSchema } from '@/client/model/config/ClaimConfigurationResource'
import {
  type PasswordConfigurationResource,
  passwordConfigurationResourceSchema
} from '@/client/model/config/PasswordConfigurationResource'

export interface ConfigurationResource {
  claims: Array<ClaimConfigurationResource>,
  features: FeaturesConfigurationResource,
  password?: PasswordConfigurationResource,
  providers: Array<ProviderConfigurationResource>
}

export const configurationResourceSchema: JSONSchemaType<ConfigurationResource> = {
  type: 'object',
  additionalProperties: true,
  properties: {
    'claims': {
      type: 'array',
      items: {
        ...claimConfigurationResourceSchema
      }
    },
    'features': {
      ...featuresConfigurationResourceSchema
    },
    'password': {
      ...passwordConfigurationResourceSchema,
      nullable: true
    },
    'providers': {
      type: 'array',
      items: {
        ...providerConfigurationResourceSchema
      }
    }
  },
  required: ['claims', 'features', 'providers']
}
