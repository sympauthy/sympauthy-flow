<script lang="ts" setup>
import { SaDialog, SaField, SaInput } from '@sympauthy/design'
import { useField } from 'vee-validate'
import { computed, ref, toRef } from 'vue'

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

const open = ref(false)

const openDialog = () => {
  open.value = true
}

const select = (value: string) => {
  handleChange(value)
  open.value = false
}

const cancel = () => {
  open.value = false
}
</script>

<template>
  <sa-field :error="error" :for="props.name" :label="label ?? ''">
    <sa-input
      :id="props.name"
      :disabled="disabled"
      :invalid="error !== undefined"
      :model-value="inputValue"
      readonly
      @click="openDialog"
    />
  </sa-field>

  <!-- Beside the field rather than in it: an input in the dialog would be described by its error. -->
  <sa-dialog :open="open" :title="label" @close="cancel">
    <slot :cancel="cancel" :select="select"></slot>
  </sa-dialog>
</template>

<style scoped></style>
