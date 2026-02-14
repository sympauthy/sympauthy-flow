import type { ClaimsFlowResource } from '@/client/model/ClaimsFlowResource.ts'
import { AbstractApi } from '@/client/AbstractApi'
import type { Pinia } from 'pinia'
import { claimsFlowResourceSchema } from '@/client/model/ClaimsFlowResource.ts'
import type { InjectionKey } from 'vue'
import { type FlowResource, flowResultResourceSchema } from '@/client/model/FlowResource.ts'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class ClaimApi extends AbstractApi {

  constructor(pinia: Pinia) {
    super(pinia)
  }

  async fetchClaims(): Promise<SuccessApiResponse<ClaimsFlowResource> | ErrorApiResponse> {
    return this.get<ClaimsFlowResource>({
      authenticated: true,
      path: '/api/v1/flow/claims',
      schema: claimsFlowResourceSchema
    })
  }

  async collectClaims(body: any): Promise<SuccessApiResponse<FlowResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/claims',
      body: body,
      schema: flowResultResourceSchema
    })
  }
}

export const claimApiKey: InjectionKey<ClaimApi> = Symbol('ClaimApi')
