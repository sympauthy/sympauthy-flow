import type { JSONSchemaType } from 'ajv'

/**
 * Outcome of asking for a new code to reset a password. It is the same whether or not a user holds
 * the login, and whether or not a code was sent.
 */
export type ResendResetPasswordCodeResultResource = {
  resent: boolean
  /** Date and time at which a new code can be asked for, in UTC. */
  resend_date?: string
}

export const resendResetPasswordCodeResultResourceSchema: JSONSchemaType<ResendResetPasswordCodeResultResource> =
  {
    type: 'object',
    properties: {
      resent: {
        type: 'boolean'
      },
      resend_date: {
        type: 'string',
        nullable: true
      }
    },
    required: ['resent'],
    additionalProperties: true
  }
