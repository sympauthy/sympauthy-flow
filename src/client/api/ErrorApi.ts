import { AbstractApi } from '@/client/AbstractApi'
import {
  type FlowErrorResource,
  flowErrorResourceSchema
} from '@/client/model/FlowErrorResource'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class ErrorApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async getError(): Promise<SuccessApiResponse<FlowErrorResource> | ErrorApiResponse> {
    return this.get({
      authenticated: true,
      path: '/api/v1/flow/errors',
      schema: flowErrorResourceSchema
    })
  }
}

export const errorApiKey: InjectionKey<ErrorApi> = Symbol('ErrorApi')
