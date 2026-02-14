import { AbstractApi } from '@/client/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import {
  type ClaimsValidationFlowResource,
  claimValidationFlowResourceSchema
} from '@/client/model/ClaimsValidationFlowResource.ts'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'
import type { FlowResource } from '@/client/model/FlowResource.ts'
import { flowResultResourceSchema } from '@/client/model/FlowResource.ts'
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
  ): Promise<SuccessApiResponse<ClaimsValidationFlowResource> | ErrorApiResponse> {
    return this.get({
      authenticated: true,
      path: `/api/v1/flow/claims/validation/${media}`,
      schema: claimValidationFlowResourceSchema
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
  }): Promise<SuccessApiResponse<FlowResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/claims/validation',
      body: body,
      schema: flowResultResourceSchema
    })
  }
}

export const claimsValidationApiKey: InjectionKey<ClaimsValidationApi> = Symbol('ClaimsValidationApi')
