<script setup lang="ts">
import type {ImageDto} from "#shared/dto";

const props = withDefaults(defineProps<{
  image: ImageDto,
  compact?: boolean,
}>(), {
  compact: false,
})

const classes = computed(() => {
  const classes = []
  if (props.compact) {
    classes.push([

    ])
  } else {
    classes.push([
        'text-3xl'
    ])
  }

  return classes
})

</script>

<template>
  <div class="font-bold text-center my-3" :class="classes.join(' ')">
    <nuxt-link v-if="compact" :to="`/gallery/images/${props.image.id}`">
      {{ props.image.title }}
    </nuxt-link>
    <span v-else>{{ props.image.title }}</span>
  </div>
</template>

<style scoped>

</style>