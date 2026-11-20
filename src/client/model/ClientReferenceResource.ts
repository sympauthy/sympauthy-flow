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

// The server leaves display_name out when the deployment gives the client none:
// the identifier then stands in.
export function getClientName(client: ClientReferenceResource): string {
  return client.display_name ?? client.id
}
