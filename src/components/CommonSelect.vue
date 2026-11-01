<script lang="ts" setup>
import { FormField, FormInput } from '@sympauthy/design'
import { useField } from 'vee-validate'
import { computed, ref, toRef } from 'vue'
import CommonModal from '@/components/CommonModal.vue'

interface Props {
  name: string
  label?: string
  value?: string
  errorMessage?: string
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false
})

// use `toRef` to create reactive references to `name` prop which is passed to `useField`
// this is important because vee-validte needs to know if the field name changes
// https://vee-validate.logaretm.com/v4/guide/composition-api/caveats
const name = toRef(props, 'name')

// we don't provide any rules here because we are using form-level validation
// https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation
const {
  value: inputValue,
  errorMessage: validationErrorMessage,
  handleChange
} = useField<string | undefined>(name, undefined, {
  initialValue: props.value
})

const error = computed(() => props.errorMessage ?? validationErrorMessage.value)

const modal = ref<InstanceType<typeof CommonModal> | undefined>(undefined)

const openModal = () => {
  modal.value?.openModal()
}

const select = (value: string) => {
  handleChange(value)
  modal.value?.closeModal()
}

const cancel = () => {
  modal.value?.closeModal()
}
</script>

<template>
  <form-field :error="error" :for="props.name" :label="label ?? ''">
    <form-input
      :id="props.name"
      :disabled="disabled"
      :invalid="error !== undefined"
      :model-value="inputValue"
      readonly
      @click="openModal"
    />

    <common-modal ref="modal">
      <slot :cancel="cancel" :select="select"></slot>
    </common-modal>
  </form-field>
</template>

<style scoped></style>
