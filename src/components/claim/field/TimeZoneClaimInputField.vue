<script lang="ts" setup>
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
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false
})

const { t } = useI18n()
const timeZoneApi = injectRequired(timeZoneApiKey)

const isLoadingTimeZones = ref(false)
const search = ref<string | undefined>(undefined)
const timeZones = ref<Array<TimeZoneResource>>([])

const loadTimeZones = async () => {
  if (isLoadingTimeZones.value) return
  isLoadingTimeZones.value = true

  const response = await timeZoneApi.fetchTimeZones(props.options.claim.id)
  if (response instanceof SuccessApiResponse) {
    timeZones.value = response.content
  }

  isLoadingTimeZones.value = false
}

// The IANA names write a space as an underscore: a person searches for "new york", not "New_York".
const normalizeForSearch = (value: string) => value.toLowerCase().replaceAll('_', ' ')

const filteredTimeZones = computed(() => {
  const searchedValue = search.value
  if (searchedValue === undefined) {
    return timeZones.value
  }
  const normalizedValue = normalizeForSearch(searchedValue)
  return timeZones.value?.filter(
    (it) =>
      normalizeForSearch(it.id).includes(normalizedValue) || it.offset.includes(normalizedValue)
  )
})

onMounted(async () => {
  await loadTimeZones()
})
</script>

<template>
  <common-select
    :disabled="disabled"
    :error-message="errorMessage"
    :label="options.claim.name"
    :loading="loading"
    :name="options.claim.id"
  >
    <template v-slot:default="{ select, cancel }">
      <search-card
        v-model="search"
        :placeholder="t('components.tz_claim_input_field.placeholder')"
        @close="cancel"
      >
        <search-card-item
          v-for="timeZone in filteredTimeZones"
          :key="timeZone.id"
          @click="select(timeZone.id)"
        >
          {{ timeZone.id }}
        </search-card-item>
        <p v-if="search && filteredTimeZones.length === 0" class="p-3 text-center text-gray-500">
          {{ t('components.tz_claim_input_field.no_match') }}
        </p>
      </search-card>
    </template>
  </common-select>
</template>

<style scoped></style>
