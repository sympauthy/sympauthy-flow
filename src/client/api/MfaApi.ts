import { AbstractApi } from '@/client/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import type { MfaFlowResource } from '@/client/model/MfaFlowResource'
import { mfaFlowResourceSchema } from '@/client/model/MfaFlowResource'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class MfaApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async fetchMfaStep(): Promise<SuccessApiResponse<MfaFlowResource> | ErrorApiResponse> {
    return this.get({
      authenticated: true,
      path: '/api/v1/flow/mfa',
      schema: mfaFlowResourceSchema
    })
  }
}

export const mfaApiKey: InjectionKey<MfaApi> = Symbol('MfaApi')
