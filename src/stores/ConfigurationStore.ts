import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { configurationApiKey } from '@/client/api/ConfigurationApi'
import type { ConfigurationResource } from '@/client/model/ConfigurationResource'

export const useConfiguration = defineStore('configuration', () => {
  const configurationApi = inject(configurationApiKey)

  const configuration = ref<ConfigurationResource>()

  const loadConfiguration = async () => {
    configuration.value = await configurationApi?.fetchConfiguration()
  }

  return { configuration, loadConfiguration }
})
