import { AbstractApi } from '@/client/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import type { FlowResource } from '@/client/model/FlowResource'
import { flowResultResourceSchema } from '@/client/model/FlowResource'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class CancelApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async cancel(): Promise<SuccessApiResponse<FlowResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/cancel',
      body: {},
      schema: flowResultResourceSchema
    })
  }
}

export const cancelApiKey: InjectionKey<CancelApi> = Symbol('CancelApi')
