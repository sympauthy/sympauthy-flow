import type { JSONSchemaType } from 'ajv'
import {
  type ClientReferenceResource,
  clientReferenceResourceSchema
} from '@/client/model/ClientReferenceResource'
import type { PasswordResource } from '@/client/model/PasswordResource'
import { passwordResourceSchema } from '@/client/model/PasswordResource'

/**
 * Configuration of the sign-up step.
 *
 * The resource returns EITHER the sign-up configuration OR a `redirect_url` to
 * the step the end-user actually belongs on (e.g. sign-up disabled redirects to
 * sign-in, an already authenticated end-user redirects to the next step).
 * Consumers must check `redirect_url` first; when it is set all config fields
 * are null.
 *
 * All URLs (`redirect_url`, `sign_in_redirect_url`) are built by the server with
 * the flow `state` already appended.
 */
export interface SignUpFlowResource {
  /**
   * Password sign-up configuration; null/absent when password sign-up is disabled.
   * The claims to collect at sign-up are exposed as `password.identifier_claims`.
   */
  password?: PasswordResource
  /** Link to the sign-in step; present iff sign-in is allowed (absent during an invitation flow). */
  sign_in_redirect_url?: string
  /** The client the session was started for; absent on a session no client started. */
  client?: ClientReferenceResource
  /** Link leaving the flow; absent where leaving has nowhere to go. */
  cancel_url?: string
  /** Set when sign-up does not apply; the end-user should be redirected there. */
  redirect_url?: string
}

export const signUpFlowResourceSchema: JSONSchemaType<SignUpFlowResource> = {
  type: 'object',
  properties: {
    password: {
      ...passwordResourceSchema,
      nullable: true
    },
    sign_in_redirect_url: {
      type: 'string',
      nullable: true
    },
    client: {
      ...clientReferenceResourceSchema,
      nullable: true
    },
    cancel_url: {
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
