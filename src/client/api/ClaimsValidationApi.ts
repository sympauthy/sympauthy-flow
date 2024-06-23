import { AbstractApi } from '@/client/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import type { ClaimsValidationResource } from '@/client/model/ClaimsValidationResource'
import { claimsValidationResourceSchema } from '@/client/model/ClaimsValidationResource'
import {
  type ClaimValidationResultResource,
  claimValidationResultResourceSchema
} from '@/client/model/ClaimValidationResultResource'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class ClaimsValidationApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async fetchValidationCodes(): Promise<SuccessApiResponse<ClaimsValidationResource> | ErrorApiResponse> {
    return this.get({
      authenticated: true,
      path: '/api/v1/flow/claims/validation-codes',
      schema: claimsValidationResourceSchema
    })
  }

  async validateClaim(body: { media: string, code: string }): Promise<SuccessApiResponse<ClaimValidationResultResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/claims/validation-codes',
      body: body,
      schema: claimValidationResultResourceSchema
    })
  }
}

export const claimsValidationApiKey: InjectionKey<ClaimsValidationApi> = Symbol('ClaimsValidationApi')
