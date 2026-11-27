import { isString } from '@/utils/StringUtils'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Return the id of the interactive flow session the state names, or undefined when it names none.
 *
 * The state is a token the server signs, whose subject is the id of the session. It is read without
 * checking the signature, which only the server can: a link may carry a state made by anyone, so
 * only a subject that reads as a UUID is returned, and a link cannot make the page show a message
 * that neither the server nor this flow wrote.
 */
export function getSessionId(state: string): string | undefined {
  const parts = state.split('.')
  if (parts.length !== 3) {
    return undefined
  }
  let payload: unknown
  try {
    const base64 = parts[1]!.replace(/-/g, '+').replace(/_/g, '/')
    payload = JSON.parse(atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')))
  } catch {
    return undefined
  }
  if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
    return undefined
  }
  const subject = (payload as Record<string, unknown>)['sub']
  return isString(subject) && UUID_PATTERN.test(subject) ? subject : undefined
}
