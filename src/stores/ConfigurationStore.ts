import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { configurationApiKey } from '@/client/api/ConfigurationApi'
import type { ConfigurationResource } from '@/client/model/config/ConfigurationResource'
import { isSuccess } from '@/client/SuccessApiResponse'

export const useConfiguration = defineStore('configuration', () => {
  const configurationApi = inject(configurationApiKey)

  const configuration = ref<ConfigurationResource>()

  const loadConfiguration = async (): Promise<ConfigurationResource | undefined> => {
    if (configuration.value === undefined) {
      const response = await configurationApi?.fetchConfiguration()
      if (isSuccess<ConfigurationResource>(response)) {
        configuration.value = response.content
      }
    }
    return configuration.value
  }

  return { configuration, loadConfiguration }
})
