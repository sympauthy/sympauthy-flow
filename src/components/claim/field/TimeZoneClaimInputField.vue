<script lang='ts' setup>
import CommonSelect from '@/components/CommonSelect.vue'
import type { ClaimInputFieldOptions } from '@/services/ClaimFormService'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import { injectRequired } from '@/utils/VueUtils'
import { timeZoneApiKey } from '@/client/api/TimeZoneApi'
import type { TimeZoneResource } from '@/client/model/TimeZoneResource'
import SearchCard from '@/components/card/SearchCard.vue'
import SearchCardItem from '@/components/card/SearchCardItem.vue'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'

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
const search = ref<string | undefined>(undefined)
const timeZones = ref<Array<TimeZoneResource>>([])

const loadTimeZone = async () => {
  if (isLoading.value) return
  isLoading.value = true

  const response = await timeZoneApi.fetchTimeZones(props.options.claim.id)
  if (response instanceof SuccessApiResponse) {
    timeZones.value = response.content
  }
  // FIXME: Handle errors

  isLoading.value = false
}

const filteredTimeZones = computed(() => {
  if (search.value === undefined) {
    return timeZones.value
  }
  return timeZones.value?.filter(it => it.id.includes(search.value))
})

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
      <search-card v-model='search'
                   :placeholder='t("components.tz_claim_input_field.placeholder")'
                   class='h-2/3'
                   @close='cancel'>
        <search-card-item v-for='timeZone in filteredTimeZones' :key='timeZone.id'
                          @click='select(timeZone.id)'>
          {{ timeZone.id }}
        </search-card-item>
      </search-card>
    </template>
  </common-select>
</template>

<style scoped>

</style>
