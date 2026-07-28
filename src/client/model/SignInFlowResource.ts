import type { JSONSchemaType } from 'ajv'
import type { PasswordResource } from '@/client/model/PasswordResource'
import { passwordResourceSchema } from '@/client/model/PasswordResource'
import type { ProviderResource } from '@/client/model/ProviderResource'
import { providerResourceSchema } from '@/client/model/ProviderResource'

/**
 * Configuration of the sign-in step.
 *
 * The resource returns EITHER the sign-in configuration OR a `redirect_url` to
 * the step the end-user actually belongs on (e.g. an invitation flow redirects
 * to sign-up, an already authenticated end-user redirects to the next step).
 * Consumers must check `redirect_url` first; when it is set all config fields
 * are null.
 *
 * All URLs (`redirect_url`, `sign_up_redirect_url`, provider `authorize_url`)
 * are built by the server with the flow `state` already appended.
 */
export interface SignInFlowResource {
  /** Password sign-in configuration; null/absent when password sign-in is disabled. */
  password?: PasswordResource
  /** Third-party providers to offer; null/empty when none. */
  providers?: Array<ProviderResource>
  /** Link to the sign-up step; present iff sign-up is allowed for this attempt. */
  sign_up_redirect_url?: string
  /** Set when sign-in does not apply; the end-user should be redirected there. */
  redirect_url?: string
}

export const signInFlowResourceSchema: JSONSchemaType<SignInFlowResource> = {
  type: 'object',
  properties: {
    password: {
      ...passwordResourceSchema,
      nullable: true
    },
    providers: {
      type: 'array',
      items: {
        ...providerResourceSchema
      },
      nullable: true
    },
    sign_up_redirect_url: {
      type: 'string',
      nullable: true
    },
    redirect_url: {
      type: 'string',
      nullable: true
    }
  },
  additionalProperties: true
}
