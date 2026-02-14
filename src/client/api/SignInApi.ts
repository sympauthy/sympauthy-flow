import { AbstractApi } from '@/client/AbstractApi'
import {
  type FlowResource,
  flowResultResourceSchema
} from '@/client/model/FlowResource.ts'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class SignInApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async signIn(login: string, password: string): Promise<SuccessApiResponse<FlowResource> | ErrorApiResponse> {
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
