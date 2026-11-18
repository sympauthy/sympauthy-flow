import type { JSONSchemaType } from 'ajv'
import { Temporal } from '@js-temporal/polyfill'
import { getDurationUntil } from '@/utils/DurationUtils'

export type ValidationCodeResource = {
  id: string
  media: string
  reasons: Array<string>
  resend_date?: string
}

/**
 * Return the duration to wait before resending the provided code is possible.
 * Return undefined if the code has no resend date or if the resend date is already passed.
 */
export const getDurationToWaitBeforeResend = (
  code?: ValidationCodeResource
): Temporal.Duration | undefined => getDurationUntil(code?.resend_date)

export const validationCodeResourceSchema: JSONSchemaType<ValidationCodeResource> = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    media: {
      type: ['string']
    },
    reasons: {
      type: 'array',
      items: {
        type: ['string']
      }
    },
    resend_date: {
      type: 'string',
      nullable: true
    }
  },
  required: ['id', 'media', 'reasons'],
  additionalProperties: true
}
