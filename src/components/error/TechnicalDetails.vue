<script lang="ts" setup>
import { SaDisclosure } from '@sympauthy/design'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CopyDetailsButton from '@/components/error/CopyDetailsButton.vue'
import { formatTechnicalDetails, type TechnicalDetail } from '@/utils/TechnicalDetailsUtils'

/**
 * What support needs to look the failure up, shut until the person opens it: most people never
 * need it, and the one who writes to support copies it from here.
 */
const props = defineProps<{
  details: Array<TechnicalDetail>
}>()

const { t } = useI18n()

const copiedDetails = computed(() => formatTechnicalDetails(props.details))
</script>

<template>
  <sa-disclosure :label="t('pages.error.technical_details.title')">
    <div class="flex flex-col gap-3 pt-1">
      <dl class="flex flex-col gap-1">
        <div v-for="detail in details" :key="detail.label" class="flex flex-wrap gap-x-2">
          <dt class="text-gray-500">{{ detail.label }}</dt>
          <dd class="min-w-0 font-mono break-all">{{ detail.value }}</dd>
        </div>
      </dl>
      <copy-details-button
        :label="t('pages.error.technical_details.copy')"
        :value="copiedDetails"
      />
    </div>
  </sa-disclosure>
</template>
