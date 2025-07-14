<script lang='ts' setup>

interface Props {
  label?: string
  loading?: boolean,
  submitting?: boolean,
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  submitting: false,
  disabled: false
})

</script>

<template>
  <div class='flex items-baseline justify-center '>
    <p>{{ props.label }}</p>
    <template v-if='loading'>
      <p class='animate-pulse h-2 bg-slate-300 rounded cursor-progress' style='width: 5rem;'></p>
    </template>
  </div>
</template>

<style scoped>

</style>
