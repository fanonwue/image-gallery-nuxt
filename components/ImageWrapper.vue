<script setup lang="ts">
import type {ImageDto, ImageVariant} from "#shared/dto";
import {imageRoundedClassesString} from "#utils/client";

const props = withDefaults(defineProps<{
  image: ImageDto,
  rounded?: boolean,
  variant?: ImageVariant,
  heightLimit?: string
}>(), {
  heightLimit: "100vh",
  rounded: true,
  variant: "original"
})


const imageUrl = computed(() => props.variant == "original" ? props.image.originalUrl : props.image.thumbnailUrl)
</script>

<template>
  <picture>
    <img class="w-full h-auto aspect-auto" :style="`max-height: ${props.heightLimit}`" :class="imageRoundedClassesString(rounded)" :src="imageUrl" :alt="image.title"/>
  </picture>
</template>