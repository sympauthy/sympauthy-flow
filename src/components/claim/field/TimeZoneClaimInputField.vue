<script lang='ts' setup>
import CommonSelect from '@/components/CommonSelect.vue'
import type { ClaimInputFieldOptions } from '@/services/ClaimFormService'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { injectRequired } from '@/utils/VueUtils'
import { timeZoneApiKey } from '@/client/api/TimeZoneApi'
import type { TimeZoneResource } from '@/client/model/TimeZoneResource'
import SearchCard from '@/components/card/SearchCard.vue'
import SearchCardItem from '@/components/card/SearchCardItem.vue'

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
    <template v-slot:default='{select, cancel}'>
      <search-card :placeholder='t("components.tz_claim_input_field.placeholder")'
                   class='h-2/3'
                   @close='cancel'>
        <search-card-item v-for='timeZone in timeZones' :key='timeZone.id'
                          @click='select(timeZone.id)'>
          {{ timeZone.id }}
        </search-card-item>
      </search-card>
    </template>
  </common-select>
</template>

<style scoped>

</style>
