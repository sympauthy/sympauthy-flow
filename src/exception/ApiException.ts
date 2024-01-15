import { translateMessage } from '@/i18n'

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
    readonly response?: Response
  ) {
  }
}

export function makeApiException(
  errorCode: string,
  descriptionKey?: string
): ApiException {
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
