import { AbstractApi } from '@/client/api/AbstractApi'
import type { ConfigurationResource } from '@/client/model/ConfigurationResource'
import { configurationResourceSchema } from '@/client/model/ConfigurationResource'
import type { InjectionKey } from 'vue'

export class ConfigurationApi extends AbstractApi {

  constructor() {
    super()
  }

  async fetchConfiguration(): Promise<ConfigurationResource> {
    return this.get({
      path: '/api/flow/1.0/configuration',
      schema: configurationResourceSchema
    })
  }
}

export const configurationApiKey: InjectionKey<ConfigurationApi> = Symbol('ConfigurationApi')
