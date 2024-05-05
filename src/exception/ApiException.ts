import { translateMessage } from '@/i18n'
import type { ErrorResource } from '@/client/model/ErrorResource'

export class ApiException {
  constructor(
    /**
     * A code identifying the error.
     */
    readonly errorCode: string,
    /**
     * A message containing technical details about the error.
     */
    readonly details: string,
    /**
     * A message explaining the error to the end-user. It may contain information on how to recover from the issue.
     */
    readonly description?: string,
    /**
     * The original error responded by the authorization server.
     * Only present if the error is actually originated from the authorization server.
     */
    readonly error?: ErrorResource,
    /**
     * The original response
     */
    readonly response?: Response
  ) {}
}

export function makeApiException(errorCode: string, descriptionKey?: string): ApiException {
  return new ApiException(
    errorCode,
    translateMessage(errorCode),
    descriptionKey ? translateMessage(descriptionKey) : undefined
  )
}

export function getErrorMessageOrThrow(e: any): string {
  if (e instanceof ApiException) {
    return e.description ?? e.details ?? e.errorCode
  } else {
    throw e
  }
}

export function getErrorMessageForProperties(e: any): Record<string, string> | undefined {
  if (e instanceof ApiException && e.error?.properties !== undefined) {
    const errorMessages: Record<string, string> = {}
    for (const property of e.error.properties) {
      if (property.description !== undefined) {
        errorMessages[property.path] = property.description
      }
    }
    return errorMessages
  } else {
    return undefined
  }
}
