import { AbstractApi } from '@/client/api/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import type { SignUpResultResource } from '@/client/model/SignUpResultResource'
import { signUpResultResourceSchema } from '@/client/model/SignUpResultResource'

export interface SignUpInputResource {
  password: string
}

export class SignUpApi extends AbstractApi {

  constructor(pinia: Pinia) {
    super(pinia)
  }

  async signUp(body: SignUpInputResource): Promise<SignUpResultResource> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/sign-up',
      body: body,
      schema: signUpResultResourceSchema
    })
  }
}

export const signUpApiKey: InjectionKey<SignUpApi> = Symbol('SignUpApi')
