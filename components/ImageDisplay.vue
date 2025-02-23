<script setup lang="ts">
import type {ImageDto, ImageVariant} from "#shared/dto";
import {imageRoundedClassesString} from "#utils/client";

const props = withDefaults(defineProps<{
  image: ImageDto,
  addLink?: boolean,
  compact?: boolean,
  rounded?: boolean,
  variant?: ImageVariant
}>(), {
  addLink: false,
  compact: false,
  rounded: true,
  variant: "original",
})

const fullImageLink = computed(() => {
  if (!props.addLink) return undefined
  return `/gallery/images/${props.image.id}`
})
</script>

<template>
  <div class="image-container flex justify-center shadow-lg shadow-gray-500" :class="imageRoundedClassesString(rounded)">
    <nuxt-link v-if="fullImageLink" :to="fullImageLink">
      <image-wrapper :image="image" :rounded="rounded" :variant="variant" />
    </nuxt-link>
    <image-wrapper v-else :image="image" :rounded="rounded" :variant="variant" />
  </div>
</template>