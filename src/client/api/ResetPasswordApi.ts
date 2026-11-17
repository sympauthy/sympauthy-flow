import { AbstractApi } from '@/client/AbstractApi'
import type { Pinia } from 'pinia'
import type { InjectionKey } from 'vue'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { type FlowResource, flowResultResourceSchema } from '@/client/model/FlowResource'
import {
  type ResetPasswordFlowResource,
  resetPasswordFlowResourceSchema
} from '@/client/model/ResetPasswordFlowResource'
import {
  type ResetPasswordValidationFlowResource,
  resetPasswordValidationFlowResourceSchema
} from '@/client/model/ResetPasswordValidationFlowResource'
import {
  type ResendResetPasswordCodeResultResource,
  resendResetPasswordCodeResultResourceSchema
} from '@/client/model/ResendResetPasswordCodeResultResource'
import {
  type ResetPasswordChoiceFlowResource,
  resetPasswordChoiceFlowResourceSchema
} from '@/client/model/ResetPasswordChoiceFlowResource'

/**
 * The steps an end-user resets a forgotten password through, reached from the sign-in step: asking
 * for a code for a login, entering the code, and choosing the new password.
 */
export class ResetPasswordApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async fetchResetPassword(): Promise<
    SuccessApiResponse<ResetPasswordFlowResource> | ErrorApiResponse
  > {
    return this.get({
      authenticated: true,
      path: '/api/v1/flow/password-reset',
      schema: resetPasswordFlowResourceSchema
    })
  }

  async requestCode(login: string): Promise<SuccessApiResponse<FlowResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/password-reset',
      body: {
        login: login
      },
      schema: flowResultResourceSchema
    })
  }

  async fetchValidation(): Promise<
    SuccessApiResponse<ResetPasswordValidationFlowResource> | ErrorApiResponse
  > {
    return this.get({
      authenticated: true,
      path: '/api/v1/flow/password-reset/validation',
      schema: resetPasswordValidationFlowResourceSchema
    })
  }

  async validateCode(code: string): Promise<SuccessApiResponse<FlowResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/password-reset/validation',
      body: {
        code: code
      },
      schema: flowResultResourceSchema
    })
  }

  async resendCode(): Promise<
    SuccessApiResponse<ResendResetPasswordCodeResultResource> | ErrorApiResponse
  > {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/password-reset/validation/resend',
      body: {},
      schema: resendResetPasswordCodeResultResourceSchema
    })
  }

  async fetchChoice(): Promise<
    SuccessApiResponse<ResetPasswordChoiceFlowResource> | ErrorApiResponse
  > {
    return this.get({
      authenticated: true,
      path: '/api/v1/flow/password-reset/password',
      schema: resetPasswordChoiceFlowResourceSchema
    })
  }

  async choosePassword(
    password: string
  ): Promise<SuccessApiResponse<FlowResource> | ErrorApiResponse> {
    return this.post({
      authenticated: true,
      path: '/api/v1/flow/password-reset/password',
      body: {
        password: password
      },
      schema: flowResultResourceSchema
    })
  }
}

export const resetPasswordApiKey: InjectionKey<ResetPasswordApi> = Symbol('ResetPasswordApi')
