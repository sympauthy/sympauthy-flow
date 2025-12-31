import { AbstractApi } from '@/client/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import {
  type ClaimsValidationFlowResultResource,
  claimValidationFlowResultResourceSchema
} from '@/client/model/ClaimsValidationFlowResultResource'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'
import type { FlowResultResource } from '@/client/model/FlowResultResource.ts'
import { flowResultResourceSchema } from '@/client/model/FlowResultResource.ts'
import type { ResendClaimsValidationInputResource } from '@/client/model/ResendClaimsValidationInputResource.ts'
import {
  type ResendClaimsValidationCodeResultResource,
  resendClaimsValidationCodeResultResourceSchema
} from '@/client/model/ResendClaimsValidationCodeResultResource.ts'



export class ClaimsValidationApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async fetchValidationFlowResult(
    media: string
  ): Promise<SuccessApiResponse<ClaimsValidationFlowResultResource> | ErrorApiResponse> {
    return this.get({
      authenticated: true,
      path: `/api/v1/flow/claims/validation/${media}`,
      schema: claimValidationFlowResultResourceSchema
    })
  }

  async resendValidationCode(
    body: ResendClaimsValidationInputResource
  ): Promise<SuccessApiResponse<ResendClaimsValidationCodeResultResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/claims/validation/resend',
      body: {
        media: body.media
      },
      schema: resendClaimsValidationCodeResultResourceSchema
    })
  }

  async validateClaim(body: {
    media: string
    code: string
  }): Promise<SuccessApiResponse<FlowResultResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/claims/validation',
      body: body,
      schema: flowResultResourceSchema
    })
  }
}

export const claimsValidationApiKey: InjectionKey<ClaimsValidationApi> = Symbol('ClaimsValidationApi')
