import { AbstractApi } from '@/client/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import type { FlowResource } from '@/client/model/FlowResource.ts'
import { flowResultResourceSchema } from '@/client/model/FlowResource.ts'
import {
  type SignUpFlowResource,
  signUpFlowResourceSchema
} from '@/client/model/SignUpFlowResource'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class SignUpApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  /**
   * Fetch the configuration of the sign-up step.
   *
   * Returns either the sign-up configuration or a `redirect_url` to the step the
   * end-user actually belongs on.
   */
  async fetchSignUp(): Promise<SuccessApiResponse<SignUpFlowResource> | ErrorApiResponse> {
    return this.get({
      authenticated: true,
      path: '/api/v1/flow/sign-up',
      schema: signUpFlowResourceSchema
    })
  }

  async signUp(body: any): Promise<SuccessApiResponse<FlowResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/sign-up',
      body: body,
      schema: flowResultResourceSchema
    })
  }
}

export const signUpApiKey: InjectionKey<SignUpApi> = Symbol('SignUpApi')
