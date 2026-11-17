<script lang="ts" setup>
import { SaSkeleton, SaField, SaInput, SaPasswordInput } from '@sympauthy/design'
import { useField } from 'vee-validate'
import { computed } from 'vue'

interface Props {
  name: string
  label: string | undefined
  type: 'text' | 'password' | 'date' | 'tel'
  autocomplete?: string
  errorMessage?: string
  disabled?: boolean
  loading?: boolean
  /** Draws a password with show and hide, for a password the person is not asked to type twice. */
  revealable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  revealable: false
})

const {
  value,
  errorMessage: validationErrorMessage,
  handleBlur
} = useField<string>(() => props.name)

const error = computed(() => props.errorMessage ?? validationErrorMessage.value)
</script>

<template>
  <sa-field :error="error" :for="name" :label="label ?? ''">
    <sa-password-input
      v-if="!loading && revealable"
      :id="name"
      v-model="value"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :invalid="error !== undefined"
      :name="name"
      @blur="handleBlur"
    />
    <sa-input
      v-else-if="!loading"
      :id="name"
      v-model="value"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :invalid="error !== undefined"
      :name="name"
      :type="type"
      @blur="handleBlur"
    />
    <div v-else class="sa-control flex flex-col justify-center">
      <sa-skeleton class="h-4 max-w-[40%]" />
    </div>
  </sa-field>
</template>
