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
 * Return the duration to wait before resending the provided code is possible.
 * Return undefined if the code has no resend date or if the resend date is already passed.
 */
export const getDurationToWaitBeforeResend = (code?: ValidationCodeResource): Temporal.Duration | undefined => {
  if (code === undefined || code.resendDate === undefined) {
    return undefined
  }
  const resendDate = Temporal.PlainDateTime.from(code.resendDate)
  const duration = resendDate.since(Temporal.Now.plainDateTimeISO('UTC'))
  if (duration.sign < 0) {
    return undefined
  }
  return duration
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

