<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import BasePage from '@/components/BasePage.vue'
import { SaAlert, SaButton } from '@sympauthy/design'
import TitleContentCard from '@/components/card/TitleContentCard.vue'
import TechnicalDetails from '@/components/error/TechnicalDetails.vue'
import { errorApiKey } from '@/client/api/ErrorApi'
import { injectRequired, redirectOrPush } from '@/utils/VueUtils'
import { SuccessApiResponse } from '@/client/SuccessApiResponse'
import { type ClientReferenceResource, getClientName } from '@/client/model/ClientReferenceResource'
import {
  type ErrorReason,
  getErrorReason,
  getErrorState,
  getStateQueryParam,
  makeErrorReason,
  MISSING_STATE_ERROR_CODE
} from '@/router'
import { getSessionId } from '@/utils/StateUtils'
import { formatUtcTime, type TechnicalDetail } from '@/utils/TechnicalDetailsUtils'

/**
 * What the page draws, according to where the error came from rather than to its code.
 */
type ErrorCard = {
  /** Set for a page opened with no state: there is no session to go back to. */
  missingState: boolean
  reason: ErrorReason
  /** The client the session was started for, known only from an answer of the Error Endpoint. */
  client?: ClientReferenceResource
  /** Link leaving the flow, from an answer of the Error Endpoint; no button is shown without it. */
  cancelUrl?: string
  sessionId?: string
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const errorApi = injectRequired(errorApiKey)

const shownAt = new Date()
const isLoading = ref(true)
const card = ref<ErrorCard | undefined>(undefined)
const isReturning = ref(false)

const clientName = computed(() => getClientName(card.value?.client))

const returnLabel = computed(() =>
  clientName.value ? t('pages.error.return', [clientName.value]) : t('pages.error.return_no_client')
)

const detailLines = computed(() => {
  const details: Array<TechnicalDetail> = []
  if (card.value === undefined) {
    return details
  }
  const { reason, sessionId } = card.value
  details.push({ label: t('pages.error.technical_details.error'), value: reason.error_code })
  if (reason.details !== undefined) {
    details.push({ label: t('pages.error.technical_details.details'), value: reason.details })
  }
  if (sessionId !== undefined) {
    details.push({ label: t('pages.error.technical_details.session_id'), value: sessionId })
  }
  details.push({ label: t('pages.error.technical_details.time'), value: formatUtcTime(shownAt) })
  return details
})

function makeMissingStateCard(): ErrorCard {
  return { missingState: true, reason: makeErrorReason(MISSING_STATE_ERROR_CODE) }
}

async function fetchErrorCard(state: string): Promise<ErrorCard | undefined> {
  const sessionId = getSessionId(state)
  let response: Awaited<ReturnType<typeof errorApi.getError>>
  try {
    response = await errorApi.getError()
  } catch (error) {
    // An answer the page cannot read, such as a gateway's page sent as JSON.
    console.error('Failed to read the error of the session.', error)
    return { missingState: false, reason: makeErrorReason('api.unknown'), sessionId }
  }
  if (response instanceof SuccessApiResponse) {
    if (response.content.redirect_url !== undefined) {
      await redirectOrPush(router, response.content.redirect_url)
      return undefined
    }
    const { error_code, details, description, client, cancel_url } = response.content
    return {
      missingState: false,
      reason: makeErrorReason(error_code, details, description),
      client,
      cancelUrl: cancel_url,
      sessionId
    }
  } else {
    // The server's description, if any, explains why it could not answer, not why the session
    // failed: the card says what to do instead.
    return {
      missingState: false,
      reason: makeErrorReason(response.errorCode, response.error?.details),
      sessionId
    }
  }
}

// A button rather than a link: a browser's link preview would load it, and end the session while
// the person is still on the page.
function onReturn() {
  if (card.value?.cancelUrl !== undefined) {
    isReturning.value = true
    document.location.assign(card.value.cancelUrl)
  }
}

onMounted(async () => {
  // The page that sent the end-user here knows why, and there may be no session left to ask the
  // server about. Its state is passed along only to show the session id.
  const historyState = router.options.history.state
  const sentReason = getErrorReason(historyState)
  if (sentReason !== undefined) {
    const sentState = getErrorState(historyState)
    card.value =
      sentState === undefined
        ? makeMissingStateCard()
        : { missingState: false, reason: sentReason, sessionId: getSessionId(sentState) }
  } else {
    const state = getStateQueryParam(route)
    card.value = state === undefined ? makeMissingStateCard() : await fetchErrorCard(state)
  }
  isLoading.value = false
})
</script>

<template>
  <base-page>
    <div class="flex justify-center w-full">
      <title-content-card :loading="isLoading">
        <template v-slot:title>
          {{ card?.missingState ? t('pages.error.missing_state.title') : t('pages.error.title') }}
        </template>

        <template v-if="card">
          <p v-if="card.missingState">
            {{ t('pages.error.missing_state.description') }}
          </p>
          <sa-alert v-else>
            <template v-if="card.reason.description">{{ card.reason.description }}</template>
            <i18n-t v-else-if="clientName" keypath="pages.error.unexpected" tag="span">
              <strong>{{ clientName }}</strong>
            </i18n-t>
            <template v-else>{{ t('pages.error.unexpected_no_client') }}</template>
          </sa-alert>

          <sa-button
            v-if="card.cancelUrl"
            :label="returnLabel"
            :submitting="isReturning"
            size="large"
            type="button"
            @click="onReturn"
          />

          <technical-details :details="detailLines" />
        </template>
      </title-content-card>
    </div>
  </base-page>
</template>
