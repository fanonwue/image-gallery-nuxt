<script setup lang="ts">
import type {ImageDto, ImageVariant} from "#shared/dto";
import {imageRoundedClassesString} from "#utils/client";
import {getImageUrl} from "#utils";

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


const imageUrl = computed(() => getImageUrl(props.image, props.variant))
</script>

<template>
  <picture>
    <img class="w-full h-auto aspect-auto" :style="`max-height: ${props.heightLimit}`" :class="imageRoundedClassesString(rounded)" :src="imageUrl" :alt="image.title"/>
  </picture>
</template>