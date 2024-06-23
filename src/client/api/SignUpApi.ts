import { AbstractApi } from '@/client/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import type { FlowResultResource } from '@/client/model/FlowResultResource'
import { flowResultResourceSchema } from '@/client/model/FlowResultResource'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class SignUpApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async signUp(body: any): Promise<SuccessApiResponse<FlowResultResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/sign-up',
      body: body,
      schema: flowResultResourceSchema
    })
  }
}

export const signUpApiKey: InjectionKey<SignUpApi> = Symbol('SignUpApi')
