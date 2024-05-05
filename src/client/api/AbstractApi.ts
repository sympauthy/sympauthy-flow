import Ajv, { type JSONSchemaType } from 'ajv'
import { type ErrorResource, errorResourceSchema } from '@/client/model/ErrorResource'
import { ApiException, makeApiException } from '@/exception/ApiException'
import { translateMessage } from '@/i18n'
import type { Pinia } from 'pinia'
import { useState } from '@/stores/StateStore'

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

  async get<T>(options: QueryOptions & JsonQueryOptions<T>): Promise<T> {
    const response = await this.fetch('get', options)
    return this.parseResponseContent(response, options)
  }

  async post<T>(options: QueryOptions & PostQueryOptions & JsonQueryOptions<T>): Promise<T> {
    const response = await this.fetch('post', options, options)
    return this.parseResponseContent(response, options)
  }

  private async fetch(
    method: 'get' | 'put' | 'post' | 'delete',
    options: QueryOptions,
    postOptions?: PostQueryOptions
  ): Promise<Response> {
    const url = this.getUrl(options)
    const requestInit = await this.getRequestInit(method, options, postOptions)

    try {
      return await fetch(url, requestInit)
    } catch (error: any) {
      console.error(`Failed to fetch ${url}.`, error)
      throw makeApiException('api.unknown')
    }
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

  async checkContentType(response: Response, options: QueryOptions, expectedContentType: string) {
    const contentType = response.headers.get('Content-Type')
    if (!contentType || !contentType.includes(expectedContentType)) {
      console.error(
        `Server responded with unexpected content-type ${contentType} while fetching path ${options.path}.`
      )
      throw makeApiException('api.unknown')
    }
  }

  async checkResponseOk(response: Response, options: QueryOptions) {
    if (!response.ok) {
      await this.checkContentType(response, options, 'application/json')
      const content = await response.json()
      console.error(
        `Server responded with status ${response.status} while fetching path ${options.path}: ${JSON.stringify(content)}`
      )
      throw this.convertResponseToApiException(content, response)
    }
  }

  async parseResponseContent<T>(
    response: Response,
    options: QueryOptions & JsonQueryOptions<T>
  ): Promise<T> {
    await this.checkResponseOk(response, options)
    await this.checkContentType(response, options, 'application/json')

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
        throw makeApiException('api.unknown')
      }
    }
    return content
  }

  private getUrl(options: QueryOptions): string {
    const url = new URL(`${document.location.protocol}//${document.location.host}`)
    url.pathname = options.path
    if (options.authenticated) {
      url.searchParams.append('state', this.getState())
    }
    return url.toString()
  }

  /**
   * Return the state that must be appended to the url to authenticate this request to the authentication server.
   *
   * @private
   */
  private getState(): string {
    let state: string | undefined = undefined
    if (this.state !== undefined) {
      try {
        state = this?.state()
      } catch (e) {
        console.error('Failed to obtain state', e)
      }
    }
    if (state === undefined) {
      throw new ApiException('api.unknown', translateMessage('api.unknown'), undefined)
    }
    return state
  }

  private convertResponseToApiException(content: any, response: Response): ApiException {
    if (this.ajv.validate(errorResourceSchema, content)) {
      const error = content as ErrorResource
      return new ApiException(
        error.error_code,
        error.details || translateMessage('api.unknown'),
        error.description,
        error,
        response
      )
    } else {
      return new ApiException(
        'api.unknown',
        translateMessage('api.unknown'),
        undefined,
        undefined,
        response
      )
    }
  }
}
