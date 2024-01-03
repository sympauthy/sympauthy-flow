import { type JSONSchemaType } from 'ajv'
import { type PasswordOptionsResource, passwordOptionsResourceSchema } from '@/client/model/PasswordOptionsResource'

export interface SignInOptionsResource {
  password?: PasswordOptionsResource
}

export const signInOptionsResourceSchema: JSONSchemaType<SignInOptionsResource> = {
  type: 'object',
  properties: {
    'password': {
      ...passwordOptionsResourceSchema,
      nullable: true
    }
  }
}
