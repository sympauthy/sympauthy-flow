import { AbstractApi } from '@/client/api/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import type { FlowResultResource } from '@/client/model/FlowResultResource'
import { flowResultResourceSchema } from '@/client/model/FlowResultResource'

export class SignUpApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async signUp(body: any): Promise<FlowResultResource> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/sign-up',
      body: body,
      schema: flowResultResourceSchema
    })
  }
}

export const signUpApiKey: InjectionKey<SignUpApi> = Symbol('SignUpApi')
