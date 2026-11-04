<script setup lang="ts">
import { SaBrandLogo } from '@sympauthy/design'
import { useI18n } from 'vue-i18n'
import { brandKey, getBrandName, SYMPAUTHY_NAME } from '@/utils/BrandUtils'
import { injectRequired } from '@/utils/VueUtils'

const { t } = useI18n()
const brand = injectRequired(brandKey)

const name = getBrandName(brand)
// The wordmark and the tagline are SympAuthy's own: a deployment's name is written as it is.
const isSympAuthy = name === SYMPAUTHY_NAME
</script>

<template>
  <div class="flex flex-col gap-6 pt-8 pb-6">
    <header class="flex w-full flex-col items-center gap-1 text-center">
      <div class="flex items-center gap-3">
        <sa-brand-logo size="lg" :follow-device="brand.darkMode === 'auto'" />
        <p class="flow-brand text-gray-900">
          <template v-if="isSympAuthy">Symp<span class="font-extrabold">Authy</span></template>
          <template v-else>{{ name }}</template>
        </p>
      </div>
      <p v-if="isSympAuthy" class="flow-small text-gray-500">{{ t('pages.base.tagline') }}</p>
    </header>
    <slot />
    <i18n-t keypath="pages.base.footer" tag="p" class="flow-small w-full text-center text-gray-500">
      <a class="sa-link" href="https://sympauthy.github.io/" target="_blank">SympAuthy</a>
    </i18n-t>
  </div>
</template>
