<script lang='ts' setup>
import { RouterView } from 'vue-router'
import { useConfiguration } from '@/stores/ConfigurationStore'
import { storeToRefs } from 'pinia'

const configurationStore = useConfiguration()
const { configuration } = storeToRefs(configurationStore)
const { loadConfiguration } = configurationStore

loadConfiguration()

</script>

<template>
  <main class='container'>
    <RouterView v-if='configuration !== undefined' />
  </main>
</template>
