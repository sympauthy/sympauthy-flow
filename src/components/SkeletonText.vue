<script lang='ts' setup>

interface Props {
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 1
})

</script>

<template>
  <div>
    <div v-for='i of props.count' :key='i' class='w-full animate-pulse h-2 bg-slate-300 rounded cursor-progress'></div>
  </div>
</template>

<style scoped>

</style>
