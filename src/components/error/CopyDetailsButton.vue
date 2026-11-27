<script lang="ts" setup>
import { CheckIcon, ClipboardDocumentIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import { SaButton } from '@sympauthy/design'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * The button that copies the details, showing its label: it answers as the design system's copy
 * control does, in the package's own words, and says a refusal of the clipboard rather than
 * swallowing it.
 */
const props = defineProps<{
  value: string
  label: string
}>()

const { t } = useI18n()

const state = ref<'idle' | 'copied' | 'failed'>('idle')

// Announced once the details are copied or when the browser refuses.
const outcome = computed(() =>
  state.value === 'copied'
    ? t('sa.copy.copied')
    : state.value === 'failed'
      ? t('sa.copy.failed')
      : ''
)
const icon = computed(() =>
  state.value === 'copied'
    ? CheckIcon
    : state.value === 'failed'
      ? XMarkIcon
      : ClipboardDocumentIcon
)
let timer: ReturnType<typeof setTimeout> | undefined

function show(next: 'copied' | 'failed') {
  state.value = next
  clearTimeout(timer)
  timer = setTimeout(() => {
    state.value = 'idle'
  }, 2000)
}

async function copy() {
  try {
    await navigator.clipboard.writeText(props.value)
    show('copied')
  } catch (error) {
    console.error('Failed to copy the details', error)
    show('failed')
  }
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div>
    <!-- The name stays the label: the outcome is announced once, by the status below. -->
    <sa-button
      :aria-label="label"
      variant="outline"
      :icon="icon"
      :label="outcome || label"
      type="button"
      @click="copy"
    />
    <span class="sr-only" role="status">{{ outcome }}</span>
  </div>
</template>
