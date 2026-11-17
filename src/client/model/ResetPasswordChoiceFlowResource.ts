import type { JSONSchemaType } from 'ajv'

/**
 * Configuration of the step where the end-user chooses the new password of the user a code proved.
 *
 * The resource returns EITHER the login OR a `redirect_url` to send the browser to instead, before
 * the code was accepted or once a password was chosen. Consumers must check `redirect_url` first.
 */
export type ResetPasswordChoiceFlowResource = {
  /** Login the end-user asked to reset the password of, to offer to a password manager. */
  login?: string
  redirect_url?: string
}

export const resetPasswordChoiceFlowResourceSchema: JSONSchemaType<ResetPasswordChoiceFlowResource> =
  {
    type: 'object',
    properties: {
      login: {
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
