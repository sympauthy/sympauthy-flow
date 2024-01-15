import { AbstractApi } from '@/client/api/AbstractApi'
import { type SignInResultResource, signInResultResourceSchema } from '@/client/model/SignInResultResource'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import { ConfigurationApi } from '@/client/api/ConfigurationApi'

export class SignInApi extends AbstractApi {

  constructor(pinia: Pinia) {
    super(pinia)
  }

  async signIn(login: string, password: string): Promise<SignInResultResource> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/sign-in',
      body: {
        login: login,
        password: password
      },
      schema: signInResultResourceSchema
    })
  }
}

export const signInApiKey: InjectionKey<SignInApi> = Symbol('SignInApi')
