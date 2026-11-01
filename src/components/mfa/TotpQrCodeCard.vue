<script lang="ts" setup>
import { CheckIcon, ClipboardIcon } from '@heroicons/vue/20/solid'
import { CommonButton, outlineColoredButton } from '@sympauthy/design'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import QRCode from 'qrcode'

interface Props {
  uri: string
  secret: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const { t } = useI18n()

const qrDataUrl = ref<string | undefined>(undefined)
const copied = ref(false)

const copyIcon = computed(() => (copied.value ? CheckIcon : ClipboardIcon))
const copyLabel = computed(() =>
  copied.value ? t('pages.totp_enroll.copied') : t('pages.totp_enroll.copy')
)

const onCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.secret)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (e) {
    console.error('Failed to copy the key', e)
  }
}

const generateQrCode = async (uri: string) => {
  if (!uri) {
    return
  }
  try {
    qrDataUrl.value = await QRCode.toDataURL(uri)
  } catch (e) {
    console.error('Failed to generate QR code', e)
  }
}

onMounted(() => generateQrCode(props.uri))

watch(
  () => props.uri,
  (newUri) => generateQrCode(newUri)
)
</script>

<template>
  <p>
    {{ t('pages.totp_enroll.scan_instructions') }}
  </p>

  <div class="flex justify-center">
    <img
      v-if="qrDataUrl && !loading"
      :src="qrDataUrl"
      alt="QR Code"
      class="size-52 rounded-md border border-gray-200 bg-white p-2"
    />
    <div v-else class="size-52 animate-pulse rounded-md bg-gray-100" />
  </div>

  <p class="flow-small">
    {{ t('pages.totp_enroll.manual_entry') }}
  </p>
  <div class="flex items-center gap-2">
    <template v-if="!loading">
      <code
        class="min-w-0 flex-auto rounded-md bg-gray-100 px-3 py-2 font-mono text-sm break-all"
        >{{ secret }}</code
      >
      <common-button
        :button-style="outlineColoredButton"
        :icon="copyIcon"
        :label="copyLabel"
        class="shrink-0"
        type="button"
        @click="onCopy"
      />
    </template>
    <div v-else class="h-6 w-48 animate-pulse rounded-sm bg-gray-100" />
  </div>
</template>

<style scoped></style>
