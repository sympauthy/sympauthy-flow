import type { JSONSchemaType } from 'ajv'
import {
  type ClientReferenceResource,
  clientReferenceResourceSchema
} from '@/client/model/ClientReferenceResource'

/**
 * Configuration of the step where the end-user enters the code sent to reset their password.
 *
 * The step is the same whether or not a user holds the login, and whether or not a code was sent.
 * The resource returns EITHER the login OR a `redirect_url` to send the browser to instead, before a
 * code was asked for or once it was accepted. Consumers must check `redirect_url` first.
 */
export type ResetPasswordValidationFlowResource = {
  /** Login the end-user asked to reset the password of, as they entered it. */
  login?: string
  /** Date and time at which a new code can be asked for, in UTC. */
  resend_date?: string
  /** The client the session was started for; absent on a session no client started. */
  client?: ClientReferenceResource
  /** Link leaving the flow; absent where leaving has nowhere to go. */
  cancel_url?: string
  redirect_url?: string
}

export const resetPasswordValidationFlowResourceSchema: JSONSchemaType<ResetPasswordValidationFlowResource> =
  {
    type: 'object',
    properties: {
      login: {
        type: 'string',
        nullable: true
      },
      resend_date: {
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
    anyOf: [
      {
        required: ['login']
      },
      {
        required: ['redirect_url']
      }
    ],
    additionalProperties: true
  }
