import type { JSONSchemaType } from 'ajv'
import type { ClaimConfiguration } from '@/client/model/ClaimConfiguration'

/**
 * A claim to collect from the end-user on a flow step (e.g. sign-up).
 *
 * Carries everything needed to render and validate the input field:
 * `id`, `required`, `name`, `type` and an optional `group`.
 */
export type CollectableClaimResource = ClaimConfiguration

export const collectableClaimResourceSchema: JSONSchemaType<CollectableClaimResource> = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    required: {
      type: 'boolean'
    },
    name: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: ['email', 'string', 'timezone', 'date', 'phone_number']
    },
    group: {
      type: 'string',
      enum: ['identity', 'address'],
      nullable: true
    }
  },
  required: ['id', 'required', 'name', 'type'],
  additionalProperties: true
}
