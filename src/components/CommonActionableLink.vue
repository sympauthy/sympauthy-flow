<script lang="ts" setup>
interface Props {
  label?: string
  text?: string
  loading?: boolean
  submitting?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  submitting: false,
  disabled: false
})

const emit = defineEmits<{
  click: []
}>()

const onClick = () => {
  emit('click')
}
</script>

<template>
  <div class="flex items-baseline justify-center">
    <template v-if="label">
      <p class='me-3'>{{ props.label }}</p>
    </template>
    <template v-if="loading">
      <p
        class="animate-pulse h-2 bg-slate-300 rounded cursor-progress"
        style="width: 5rem"
      ></p>
    </template>
    <a @click="onClick" class="a a-primary">{{ props.text }}</a>
  </div>
</template>

<style scoped></style>
