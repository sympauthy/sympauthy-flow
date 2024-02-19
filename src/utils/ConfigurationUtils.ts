import type { InjectionKey } from 'vue'
import type { ConfigurationResource } from '@/client/model/config/ConfigurationResource'

export const configurationKey: InjectionKey<ConfigurationResource> = Symbol('Configuration')
