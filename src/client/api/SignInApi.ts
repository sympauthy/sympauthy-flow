import { AbstractApi } from '@/client/AbstractApi'
import { type FlowResource, flowResultResourceSchema } from '@/client/model/FlowResource.ts'
import {
  type SignInFlowResource,
  signInFlowResourceSchema
} from '@/client/model/SignInFlowResource'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class SignInApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  /**
   * Fetch the configuration of the sign-in step.
   *
   * Returns either the sign-in configuration or a `redirect_url` to the step the
   * end-user actually belongs on.
   */
  async fetchSignIn(): Promise<SuccessApiResponse<SignInFlowResource> | ErrorApiResponse> {
    return this.get({
      authenticated: true,
      path: '/api/v1/flow/sign-in',
      schema: signInFlowResourceSchema
    })
  }

  async signIn(
    login: string,
    password: string
  ): Promise<SuccessApiResponse<FlowResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/sign-in',
      body: {
        login: login,
        password: password
      },
      schema: flowResultResourceSchema
    })
  }
}

export const signInApiKey: InjectionKey<SignInApi> = Symbol('SignInApi')
