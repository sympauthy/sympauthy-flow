import { AbstractApi } from '@/client/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import {
  type ClaimsValidationFlowResultResource,
  claimValidationFlowResultResourceSchema
} from '@/client/model/ClaimsValidationFlowResultResource'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class ClaimsValidationApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async fetchValidationFlowResult(): Promise<SuccessApiResponse<ClaimsValidationFlowResultResource> | ErrorApiResponse> {
    return this.get({
      authenticated: true,
      path: '/api/v1/flow/claims/validation',
      schema: claimValidationFlowResultResourceSchema
    })
  }

  async validateClaim(body: {
    media: string,
    code: string
  }): Promise<SuccessApiResponse<ClaimsValidationFlowResultResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/claims/validation',
      body: body,
      schema: claimValidationFlowResultResourceSchema
    })
  }
}

export const claimsValidationApiKey: InjectionKey<ClaimsValidationApi> = Symbol('ClaimsValidationApi')
