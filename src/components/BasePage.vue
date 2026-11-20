<script setup lang="ts">
import { SaBrandLogo, SaButton } from '@sympauthy/design'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { brandKey, getBrandName, SYMPAUTHY_NAME } from '@/utils/BrandUtils'
import { injectRequired } from '@/utils/VueUtils'
import { type ClientReferenceResource, getClientName } from '@/client/model/ClientReferenceResource'

interface Props {
  /** The client the step was started for, named by the link leaving the flow. */
  client?: ClientReferenceResource
  /** Link leaving the flow, from the step; no link is shown without it. */
  cancelUrl?: string
  /** Set while a submission that may complete the session is on its way. */
  cancelDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cancelDisabled: false
})

const { t } = useI18n()
const brand = injectRequired(brandKey)

const name = getBrandName(brand)
// The wordmark and the tagline are SympAuthy's own: a deployment's name is written as it is.
const isSympAuthy = name === SYMPAUTHY_NAME

const cancelLabel = computed(() => {
  const clientName = getClientName(props.client)
  return clientName ? t('pages.base.cancel', [clientName]) : t('pages.base.cancel_no_client')
})

// A button rather than a link, as the design system draws it: it cannot be opened in another tab,
// where it would end the session as surely while a submission may be completing it, nor loaded by
// a browser's link preview, which would end it while the person is still on the page.
function onCancel() {
  if (props.cancelUrl !== undefined) {
    document.location.assign(props.cancelUrl)
  }
}
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
      <!-- Left out on a phone, so that the card starts higher. -->
      <p v-if="isSympAuthy" class="flow-small hidden text-gray-500 sm:block">
        {{ t('pages.base.tagline') }}
      </p>
    </header>
    <slot />
    <footer class="flex w-full flex-col items-center gap-2 text-center">
      <sa-button
        v-if="cancelUrl"
        :disabled="cancelDisabled"
        :label="cancelLabel"
        type="button"
        variant="text"
        @click="onCancel"
      />
      <i18n-t keypath="pages.base.footer" tag="p" class="flow-small text-gray-500">
        <a class="sa-link" href="https://sympauthy.github.io/" target="_blank">SympAuthy</a>
      </i18n-t>
    </footer>
  </div>
</template>
