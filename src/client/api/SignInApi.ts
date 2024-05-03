import { AbstractApi } from '@/client/api/AbstractApi'
import {
  type FlowResultResource,
  flowResultResourceSchema
} from '@/client/model/FlowResultResource'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'

export class SignInApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async signIn(login: string, password: string): Promise<FlowResultResource> {
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
