import Ajv, { type JSONSchemaType } from 'ajv'
import { type ErrorResource, errorResourceSchema } from '@/client/model/ErrorResource'
import { ApiException, makeApiException } from '@/exception/ApiException'
import { translateMessage } from '@/i18n'

export interface QueryOptions {
  path: string
  body?: any
  state?: string
  timeoutInMs?: number
}

export interface JsonQueryOptions<T> {
  schema: JSONSchemaType<T>
}

export class AbstractApi {

  private readonly ajv = new Ajv()

  async get<T>(options: QueryOptions & JsonQueryOptions<T>): Promise<T> {
    const response = await this.fetch('get', options)
    return this.parseResponseContent(response, options)
  }

  private async fetch(
    method: 'get' | 'put' | 'post' | 'delete',
    options: QueryOptions
  ): Promise<Response> {
    const url = this.getURL(options)
    const requestInit = await this.getRequestInit(method, options)

    try {
      return await fetch(url, requestInit)
    } catch (error: any) {
      console.error(`Failed to fetch ${url}.`, error)
      throw makeApiException('api.unknown')
    }
  }

  private async getRequestInit(
    method: string,
    options: QueryOptions
  ): Promise<RequestInit> {
    return {
      method: method,
      headers: await this.makeHeaders(options),
      credentials: 'omit'
    }
  }

  private async makeHeaders(options: QueryOptions): Promise<Headers> {
    const headers = new Headers()
    headers.set('Accept', 'application/json')
    if (options.body !== undefined) {
      headers.set('Content-Type', 'application/json')
    }
    return headers
  }

  async checkContentType(response: Response, options: QueryOptions, expectedContentType: string) {
    const contentType = response.headers.get('Content-Type')
    if (!contentType || !contentType.includes(expectedContentType)) {
      console.error('Server responded with unexpected content-type %o while fetching path %o.', contentType, options.path)
      throw makeApiException('api.unknown')
    }
  }

  async checkResponseOk(response: Response, options: QueryOptions) {
    if (!response.ok) {
      await this.checkContentType(response, options, 'application/json')
      const content = await response.json()
      console.error('Server responded with status %d while fetching path %o: %o', response.status, options.path, content)
      throw this.convertResponseToApiException(content, response)
    }
  }

  async parseResponseContent<T>(response: Response, options: QueryOptions & JsonQueryOptions<T>): Promise<T> {
    await this.checkResponseOk(response, options)
    await this.checkContentType(response, options, 'application/json')

    const content = await response.json()
    if (options.schema) {
      const validate = this.ajv.compile(options.schema)
      if (!validate(content)) {
        console.error('Server responded with content not expected schema while fetching path %o.', options.path,
          JSON.stringify(options.schema),
          JSON.stringify(content))
        throw makeApiException('api.unknown')
      }
    }
    return content
  }

  private getURL(options: QueryOptions): string {
    return options.path // FIXME
  }

  convertResponseToApiException(content: any, response: Response): ApiException {
    if (this.ajv.validate(errorResourceSchema, content)) {
      const error = content as ErrorResource
      return new ApiException(
        error.error_code,
        error.details || translateMessage('api.unknown'),
        error.description,
        response
      )
    } else {
      return new ApiException(
        'api.unknown',
        translateMessage('api.unknown'),
        undefined,
        response
      )
    }
  }
}
