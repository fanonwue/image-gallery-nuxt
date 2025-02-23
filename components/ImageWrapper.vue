<script setup lang="ts">
import type {ImageDto, ImageVariant} from "#shared/dto";
import {imageRoundedClassesString} from "#utils/client";

const props = withDefaults(defineProps<{
  image: ImageDto,
  rounded?: boolean,
  variant?: ImageVariant
}>(), {
  rounded: true,
  variant: "original"
})


const imageUrl = computed(() => props.variant == "original" ? props.image.originalUrl : props.image.thumbnailUrl)
</script>

<template>
  <picture class="">
    <img class="max-h-screen aspect-auto w-full" :class="imageRoundedClassesString(rounded)" :src="imageUrl" :alt="image.title"/>
  </picture>
</template>

<style scoped>

</style>