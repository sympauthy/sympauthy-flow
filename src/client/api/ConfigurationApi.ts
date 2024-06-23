import { AbstractApi } from '@/client/AbstractApi'
import type { ConfigurationResource } from '@/client/model/config/ConfigurationResource'
import { configurationResourceSchema } from '@/client/model/config/ConfigurationResource'
import type { InjectionKey } from 'vue'
import type { Pinia } from 'pinia'
import type { ErrorApiResponse } from '@/client/ErrorApiResponse'
import type { SuccessApiResponse } from '@/client/SuccessApiResponse'

export class ConfigurationApi extends AbstractApi {
  constructor(pinia: Pinia) {
    super(pinia)
  }

  async fetchConfiguration(): Promise<SuccessApiResponse<ConfigurationResource> | ErrorApiResponse> {
    return this.get({
      path: '/api/v1/flow/configuration',
      schema: configurationResourceSchema
    })
  }
}

export const configurationApiKey: InjectionKey<ConfigurationApi> = Symbol('ConfigurationApi')
