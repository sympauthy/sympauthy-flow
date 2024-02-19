<script lang='ts' setup>
import ConfiguredApp from '@/ConfiguredApp.vue'
</script>

<template>
  <Suspense>
    <template #default>
      <ConfiguredApp />
    </template>
    <template #fallback>
      FIXME: loading...
    </template>
  </Suspense>
</template>
