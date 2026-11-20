import type { JSONSchemaType } from 'ajv'

export type ClientReferenceResource = {
  id: string
  display_name?: string
}

export const clientReferenceResourceSchema: JSONSchemaType<ClientReferenceResource> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    display_name: {
      type: 'string',
      nullable: true
    }
  },
  required: ['id'],
  additionalProperties: true
}

/**
 * Return the name to show a person for the client, or undefined when the deployment gives it none.
 *
 * The identifier is a configuration value, not a name a person recognises: it never stands in.
 */
export function getClientName(client: ClientReferenceResource | undefined): string | undefined {
  return client?.display_name
}
