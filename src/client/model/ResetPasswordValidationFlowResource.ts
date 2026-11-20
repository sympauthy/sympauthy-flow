import type { JSONSchemaType } from 'ajv'
import { type FlowStepResource, flowStepResourceProperties } from '@/client/model/FlowStepResource'

/**
 * Configuration of the step where the end-user enters the code sent to reset their password.
 *
 * The step is the same whether or not a user holds the login, and whether or not a code was sent.
 * The resource returns EITHER the login OR a `redirect_url` to send the browser to instead, before a
 * code was asked for or once it was accepted. Consumers must check `redirect_url` first.
 */
export type ResetPasswordValidationFlowResource = FlowStepResource & {
  /** Login the end-user asked to reset the password of, as they entered it. */
  login?: string
  /** Date and time at which a new code can be asked for, in UTC. */
  resend_date?: string
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
      ...flowStepResourceProperties,
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
