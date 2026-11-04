<script lang="ts" setup>
import { SaSkeleton, SaField, SaInput } from '@sympauthy/design'
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
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false
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
    <sa-input
      v-if="!loading"
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
