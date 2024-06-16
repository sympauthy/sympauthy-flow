import { AbstractApi } from '@/client/api/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import type { ClaimsValidationResource } from '@/client/model/ClaimsValidationResource'
import { claimsValidationResourceSchema } from '@/client/model/ClaimsValidationResource'

export class ClaimsValidationApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async fetchValidationCodes(): Promise<ClaimsValidationResource> {
    return this.get({
      authenticated: true,
      path: '/api/v1/flow/claims/validation-codes',
      schema: claimsValidationResourceSchema
    })
  }
}

export const claimsValidationApiKey: InjectionKey<ClaimsValidationApi> = Symbol('ClaimsValidationApi')
