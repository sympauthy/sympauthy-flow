import Ajv, { type JSONSchemaType } from 'ajv'
import { type ErrorResource, errorResourceSchema } from '@/client/model/ErrorResource'
import { ErrorApiResponse, makeErrorApiResponse } from '@/client/ErrorApiResponse'
import { translateMessage } from '@/i18n'
import type { Pinia } from 'pinia'
import { useState } from '@/stores/StateStore'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'

export interface QueryOptions {
  path: string
  authenticated?: boolean
  timeoutInMs?: number
}

export interface PostQueryOptions {
  body: any
}

export interface JsonQueryOptions<T> {
  schema: JSONSchemaType<T>
}

export class AbstractApi {
  private readonly ajv = new Ajv()
  private readonly state: (() => string) | undefined = undefined

  constructor(pinia: Pinia) {
    const stateStore = useState(pinia)
    this.state = stateStore.state
  }

  async get<T>(options: QueryOptions & JsonQueryOptions<T>): Promise<SuccessApiResponse<T> | ErrorApiResponse> {
    const response = await this.fetch('get', options)
    return this.parseResponseContent(response, options)
  }

  async post<T>(options: QueryOptions & PostQueryOptions & JsonQueryOptions<T>): Promise<SuccessApiResponse<T> | ErrorApiResponse> {
    const response = await this.fetch('post', options, options)
    return this.parseResponseContent(response, options)
  }

  private async fetch(
    method: 'get' | 'put' | 'post' | 'delete',
    options: QueryOptions,
    postOptions?: PostQueryOptions
  ): Promise<Response | ErrorApiResponse> {
    const url = await this.getUrl(options)
    if (url instanceof ErrorApiResponse) {
      return url
    }

    const requestInit = await this.getRequestInit(method, options, postOptions)

    try {
      return await fetch(url, requestInit)
    } catch (error: any) {
      console.error(`Failed to fetch ${url}.`, error)
      return makeErrorApiResponse('api.unknown')
    }
  }

  private async getUrl(options: QueryOptions): Promise<string | ErrorApiResponse> {
    const url = new URL(`${document.location.protocol}//${document.location.host}`)
    url.pathname = options.path
    if (options.authenticated) {
      const state = await this.getState()
      if (state instanceof ErrorApiResponse) {
        return state
      }
      url.searchParams.append('state', state)
    }
    return url.toString()
  }

  /**
   * Return the state that must be appended to the url to authenticate this request to the authentication server.
   *
   * @private
   */
  private async getState(): Promise<string | ErrorApiResponse> {
    let state: string | undefined = undefined
    if (this.state !== undefined) {
      try {
        state = this?.state()
      } catch (e) {
        console.error('Failed to obtain state', e)
      }
    }
    if (state === undefined) {
      return new ErrorApiResponse('api.unknown', translateMessage('api.unknown'), undefined)
    }
    return state
  }

  private async getRequestInit(
    method: string,
    options: QueryOptions,
    postOptions?: PostQueryOptions
  ): Promise<RequestInit> {
    const init: RequestInit = {
      method: method,
      headers: await this.makeHeaders(options, postOptions),
      credentials: 'omit'
    }
    if (postOptions?.body !== undefined) {
      init.body = JSON.stringify(postOptions.body)
    }
    return init
  }

  private async makeHeaders(
    options: QueryOptions,
    postOptions?: PostQueryOptions
  ): Promise<Headers> {
    const headers = new Headers()
    headers.set('Accept', 'application/json')
    if (postOptions?.body !== undefined) {
      headers.set('Content-Type', 'application/json')
    }
    return headers
  }

  async parseResponseContent<T>(
    response: Response | ErrorApiResponse,
    options: QueryOptions & JsonQueryOptions<T>
  ): Promise<SuccessApiResponse<T> | ErrorApiResponse> {
    if (response instanceof ErrorApiResponse) {
      return response
    }

    const okCheckResult = await this.checkResponseOk(response, options)
    if (okCheckResult !== undefined) {
      return okCheckResult
    }

    const contentTypeCheckResult = await this.checkContentType(
      response, options, 'application/json'
    )
    if (contentTypeCheckResult !== undefined) {
      return contentTypeCheckResult
    }

    const content = await response.json()
    if (options.schema) {
      const validate = this.ajv.compile(options.schema)
      if (!validate(content)) {
        console.error(
          'Server responded with content not expected schema while fetching path %o.',
          options.path,
          JSON.stringify(options.schema),
          JSON.stringify(content)
        )
        return makeErrorApiResponse('api.unknown')
      }
    }
    return new SuccessApiResponse(content)
  }

  async checkResponseOk(response: Response, options: QueryOptions): Promise<ErrorApiResponse | undefined> {
    if (!response.ok) {
      return this.parseErrorResponseContent(response, options)
    }
  }

  async checkContentType(response: Response, options: QueryOptions, expectedContentType: string): Promise<ErrorApiResponse | undefined> {
    const contentType = response.headers.get('Content-Type')
    if (!contentType || !contentType.includes(expectedContentType)) {
      console.error(
        `Server responded with unexpected content-type ${contentType} while fetching path ${options.path}.`
      )
      return makeErrorApiResponse('api.unknown')
    }
  }

  private async parseErrorResponseContent(response: Response, options: QueryOptions) {
    const checkContentTypeResult = await this.checkContentType(
      response, options, 'application/json'
    )
    if (checkContentTypeResult !== undefined) {
      return checkContentTypeResult
    }

    const content = await response.json()
    console.error(
      `Server responded with status ${response.status} while fetching path ${options.path}: ${JSON.stringify(content)}`
    )
    return this.convertResponseToError(content, response)
  }

  private convertResponseToError(content: any, response: Response): ErrorApiResponse {
    if (this.ajv.validate(errorResourceSchema, content)) {
      const error = content as ErrorResource
      return new ErrorApiResponse(
        error.error_code,
        error.details || translateMessage('api.unknown'),
        error.description,
        error,
        response
      )
    } else {
      return new ErrorApiResponse(
        'api.unknown',
        translateMessage('api.unknown'),
        undefined,
        undefined,
        response
      )
    }
  }
}
