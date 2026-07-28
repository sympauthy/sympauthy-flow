import type { JSONSchemaType } from 'ajv'

/**
 * A third-party identity provider offered to the end-user on the sign-in step.
 *
 * The `authorize_url` is fully built by the server, including the flow `state`.
 * The client must NOT append the state itself.
 */
export interface ProviderResource {
  id: string
  name: string
  authorize_url: string
}

export const providerResourceSchema: JSONSchemaType<ProviderResource> = {
  type: 'object',
  additionalProperties: true,
  properties: {
    id: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    authorize_url: {
      type: 'string'
    }
  },
  required: ['id', 'name', 'authorize_url']
}
