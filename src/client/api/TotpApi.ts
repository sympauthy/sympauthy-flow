import { AbstractApi } from '@/client/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import type { TotpEnrollFlowResource } from '@/client/model/TotpEnrollFlowResource'
import { totpEnrollFlowResourceSchema } from '@/client/model/TotpEnrollFlowResource'
import type { FlowResource } from '@/client/model/FlowResource'
import { flowResultResourceSchema } from '@/client/model/FlowResource'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class TotpApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async fetchEnrollmentData(): Promise<SuccessApiResponse<TotpEnrollFlowResource> | ErrorApiResponse> {
    return this.get({
      authenticated: true,
      path: '/api/v1/flow/mfa/totp/enroll',
      schema: totpEnrollFlowResourceSchema
    })
  }

  async confirmEnrollment(code: string): Promise<SuccessApiResponse<FlowResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/mfa/totp/enroll',
      body: { code },
      schema: flowResultResourceSchema
    })
  }

  async submitChallenge(code: string): Promise<SuccessApiResponse<FlowResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/mfa/totp',
      body: { code },
      schema: flowResultResourceSchema
    })
  }
}

export const totpApiKey: InjectionKey<TotpApi> = Symbol('TotpApi')
