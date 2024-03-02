<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useConfiguration } from '@/stores/ConfigurationStore'
import { ApiException } from '@/exception/ApiException'
import { makeErrorRoute } from '@/router'
import { useI18n } from 'vue-i18n'
import { provide } from 'vue'
import { configurationKey } from '@/utils/ConfigurationUtils'

const router = useRouter()
const configurationStore = useConfiguration()

try {
  const configuration = await configurationStore.loadConfiguration()
  if (configuration !== undefined) {
    provide(configurationKey, configuration)
  }
} catch (e) {
  if (e instanceof ApiException) {
    const errorRoute = makeErrorRoute(e.errorCode, e.details, e.description)
    router.replace(errorRoute)
  } else {
    throw e
  }
}
</script>

<template>
  <RouterView />
</template>
