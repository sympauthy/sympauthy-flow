import type { ClaimsResource } from '@/client/model/ClaimsResource'
import { AbstractApi } from '@/client/AbstractApi'
import type { Pinia } from 'pinia'
import { claimsResourceSchema } from '@/client/model/ClaimsResource'
import type { InjectionKey } from 'vue'
import { type FlowResultResource, flowResultResourceSchema } from '@/client/model/FlowResultResource'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class ClaimApi extends AbstractApi {

  constructor(pinia: Pinia) {
    super(pinia)
  }

  async fetchClaims(): Promise<SuccessApiResponse<ClaimsResource> | ErrorApiResponse> {
    return this.get<ClaimsResource>({
      authenticated: true,
      path: '/api/v1/flow/claims',
      schema: claimsResourceSchema
    })
  }

  async collectClaims(body: any): Promise<SuccessApiResponse<FlowResultResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/claims',
      body: body,
      schema: flowResultResourceSchema
    })
  }
}

export const claimApiKey: InjectionKey<ClaimApi> = Symbol('ClaimApi')
