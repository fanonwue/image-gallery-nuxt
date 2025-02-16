<script setup lang="ts">

const props = withDefaults(defineProps<{
  centered?: boolean,
  separator?: boolean,
}>(), {
  centered: true,
  separator: true,
})

const classes = computed(() => {
  const classes = []
  if (props.centered) classes.push("text-center")
  return classes
})

</script>

<template>
  <div class="font-bold text-2xl my-2" :class="classes.join(' ')">
    <slot></slot>
    <Divider v-if="separator" />
  </div>
</template>

<style scoped>

</style>