import { AbstractApi } from '@/client/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import type { ConfirmFlowResource } from '@/client/model/ConfirmFlowResource'
import { confirmFlowResourceSchema } from '@/client/model/ConfirmFlowResource'
import type { FlowResource } from '@/client/model/FlowResource'
import { flowResultResourceSchema } from '@/client/model/FlowResource'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class ConfirmApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async fetchConfirmation(): Promise<SuccessApiResponse<ConfirmFlowResource> | ErrorApiResponse> {
    return this.get({
      authenticated: true,
      path: '/api/v1/flow/confirm',
      schema: confirmFlowResourceSchema
    })
  }

  async confirm(): Promise<SuccessApiResponse<FlowResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/confirm',
      body: {},
      schema: flowResultResourceSchema
    })
  }
}

export const confirmApiKey: InjectionKey<ConfirmApi> = Symbol('ConfirmApi')
