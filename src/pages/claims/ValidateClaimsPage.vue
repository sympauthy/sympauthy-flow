<script lang='ts' setup>
import BasePage from '@/components/BasePage.vue'
import { injectRequired } from '@/utils/VueUtils'
import { claimsValidationApiKey } from '@/client/api/ClaimsValidationApi'
import { onMounted, ref } from 'vue'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import { useI18n } from 'vue-i18n'
import { getErrorMessageOrThrow } from '@/exception/ApiException'
import type { ClaimsValidationResource } from '@/client/model/ClaimsValidationResource'
import ValidationCodeField from '@/components/ValidationCodeField.vue'

const { t } = useI18n()
const claimsValidationApi = injectRequired(claimsValidationApiKey)

const isLoading = ref(false)
const fetchErrorMessage = ref<string | undefined>(undefined)
const claimsValidationResource = ref<ClaimsValidationResource | undefined>(undefined)

const fetchValidationCodes = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    claimsValidationResource.value = await claimsValidationApi.fetchValidationCodes()
  } catch (e) {
    fetchErrorMessage.value = getErrorMessageOrThrow(e)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await fetchValidationCodes()
})

</script>

<template>
  <base-page>
    <div class='flex justify-center w-100'>
      <title-content-card no-padding size='default'>
        <template v-slot:title>
          <div class='pt-5 px-5'>
            {{ t('pages.validate_claims.title') }}
          </div>
        </template>

        <template v-slot:default>
          <div class='w-full'>
            <template v-if='claimsValidationResource'>
              <div v-for='code of claimsValidationResource.codes' :key='code.id'>
                <ValidationCodeField :code='code' />
              </div>
            </template>
          </div>

          <p class='w-full px-5 pb-5 mt-5 text-justify'>
            {{ t('pages.validate_claims.description') }}
          </p>
        </template>
      </title-content-card>
    </div>
  </base-page>
</template>

<style scoped>

</style>
