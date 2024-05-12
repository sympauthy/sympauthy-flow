<script lang='ts' setup>
import CommonSelect from '@/components/CommonSelect.vue'
import type { ClaimInputFieldOptions } from '@/services/ClaimFormService'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import BaseCard from '@/components/BaseCard.vue'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { injectRequired } from '@/utils/VueUtils'
import { timeZoneApiKey } from '@/client/api/TimeZoneApi'
import type { TimeZoneResource } from '@/client/model/TimeZoneResource'

interface Props {
  options: ClaimInputFieldOptions
  errorMessage?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const { t } = useI18n()
const timeZoneApi = injectRequired(timeZoneApiKey)

const isLoading = ref(false)
const timeZones = ref<Array<TimeZoneResource>>([])

const loadTimeZone = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    timeZones.value = await timeZoneApi.fetchTimeZones(props.options.claim.id)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadTimeZone()
})

</script>

<template>
  <common-select :disabled='props.disabled'
                 :error-message='errorMessage'
                 :label='props.options.claim.name'
                 :name='props.options.claim.id'>
    <base-card class='relative w-screen' no-padding>
      <!-- Search -->
      <Form>
        <div class='w-full flex flex-row items-center shadow-sm text-gray-700 p-3'>
          <MagnifyingGlassIcon class='size-6' />
          <input :placeholder='t("components.tz_claim_input_field.placeholder")'
                 class='flex-auto py-2 px-3 appearance-none leading-tight outline-none'
                 name='search'
                 type='text' />
        </div>
      </Form>

      <!-- Selector -->
      <div class='min-h-60 overflow-y-scroll'>
        <div v-for='timeZone in timeZones' :key='timeZone.id'
             class='flex flex-row border-b-1 border-gray-700 p-3'>
          {{ timeZone.id }}
        </div>
      </div>

    </base-card>
  </common-select>
</template>

<style scoped>

</style>
