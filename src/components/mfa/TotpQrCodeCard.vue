<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
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
  <p class="w-full mb-5 text-justify">
    {{ t('pages.totp_enroll.scan_instructions') }}
  </p>

  <div class="flex justify-center mb-5">
    <img v-if="qrDataUrl && !loading" :src="qrDataUrl" alt="QR Code" class="w-48 h-48" />
    <div v-else class="w-48 h-48 bg-gray-100 animate-pulse rounded-sm" />
  </div>

  <p class="w-full mb-2 text-sm text-justify">
    {{ t('pages.totp_enroll.manual_entry') }}
  </p>
  <div class="w-full mb-5 flex justify-center">
    <code v-if="!loading" class="text-sm break-all bg-gray-100 px-2 py-1 rounded-sm">{{
      secret
    }}</code>
    <div v-else class="w-48 h-6 bg-gray-100 animate-pulse rounded-sm" />
  </div>
</template>

<style scoped></style>
