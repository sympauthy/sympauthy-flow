import type { JSONSchemaType } from 'ajv'
import {
  type ClientReferenceResource,
  clientReferenceResourceSchema
} from '@/client/model/ClientReferenceResource'

/**
 * What every step answering a `GET` carries beside its own fields, absent beside a `redirect_url`.
 */
export type FlowStepResource = {
  /** The client the session was started for; absent on a session no client started. */
  client?: ClientReferenceResource
  /** Link leaving the flow; absent where leaving has nowhere to go. */
  cancel_url?: string
}

/** Spread into the `properties` of a step's schema. */
export const flowStepResourceProperties: JSONSchemaType<FlowStepResource>['properties'] = {
  client: {
    ...clientReferenceResourceSchema,
    nullable: true
  },
  cancel_url: {
    type: 'string',
    nullable: true
  }
}
