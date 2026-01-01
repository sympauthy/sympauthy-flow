import type { JSONSchemaType } from 'ajv'
import { Temporal } from '@js-temporal/polyfill'
import { formatToHumanReadable } from '@/utils/DurationUtils.ts'

export type ValidationCodeResource = {
  id: string
  media: string
  reasons: Array<string>
  resendDate?: string
}

/**
 * Format duration between now and the resend date of the provided code in a human-readable format.
 * Return undefined if the code has no resend date or if the resend date is already passed.
 */
export const formatResendDuration = (code?: ValidationCodeResource): string | undefined => {
  if (code === undefined || code.resendDate === undefined) {
    return undefined
  }
  const resendDate = Temporal.PlainDateTime.from(code.resendDate)
  const duration = Temporal.Now.plainDateTimeISO().since(resendDate)
  if (duration.sign < 1) {
    return undefined
  }
  return formatToHumanReadable(duration)
}

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
    resendDate: {
      type: 'string',
      nullable: true
    }
  },
  required: ['id', 'media', 'reasons'],
  additionalProperties: true
}

