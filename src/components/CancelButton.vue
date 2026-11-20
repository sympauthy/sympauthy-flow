<script setup lang="ts">
import { SaButton, type SaButtonProps, type SaButtonVariant } from '@sympauthy/design'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { type ClientReferenceResource, getClientName } from '@/client/model/ClientReferenceResource'

/**
 * The way back to the application that sent the person, following the step's `cancel_url`.
 * Nothing is shown without one.
 */
interface Props {
  /** The button's look, as the page places it. */
  variant?: SaButtonVariant
  size?: SaButtonProps['size']
  /** The client the step was started for, named by the button. */
  client?: ClientReferenceResource
  /** Link leaving the flow, from the step. */
  cancelUrl?: string
  /** Set while a submission that may complete the session is on its way. */
  disabled?: boolean
  /** Set once the session has ended: leaving no longer changes it, so the button does not say "Cancel". */
  ended?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  size: 'control',
  disabled: false,
  ended: false
})

const { t } = useI18n()

const label = computed(() => {
  const clientName = getClientName(props.client)
  if (props.ended) {
    return clientName
      ? t('components.cancel_button.return', [clientName])
      : t('components.cancel_button.return_no_client')
  }
  return clientName
    ? t('components.cancel_button.cancel', [clientName])
    : t('components.cancel_button.cancel_no_client')
})

// A button rather than a link, as the design system draws it: it cannot be opened in another tab,
// where it would end the session as surely while a submission may be completing it, nor loaded by
// a browser's link preview, which would end it while the person is still on the page.
function onClick() {
  if (props.cancelUrl !== undefined) {
    document.location.assign(props.cancelUrl)
  }
}
</script>

<template>
  <sa-button
    v-if="cancelUrl"
    :disabled="disabled"
    :label="label"
    :size="size"
    type="button"
    :variant="variant"
    @click="onClick"
  />
</template>
