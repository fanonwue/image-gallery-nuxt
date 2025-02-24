<script setup lang="ts">
import type {ImageDto, ImageVariant} from "#shared/dto";
import {imageRoundedClassesString} from "#utils/client";
import type {AnchorTarget} from "#shared/types";

const props = withDefaults(defineProps<{
  image: ImageDto,
  linkToImageView?: boolean,
  linkToImageFile?: boolean
  compact?: boolean,
  rounded?: boolean,
  variant?: ImageVariant
}>(), {
  linkToImageView: false,
  linkToImageFile: false,
  compact: false,
  rounded: true,
  variant: "original",
})

const imageHeightLimit = computed(() => {
  if (!props.compact) return '80vh'
})

const imageLink = computed(() => {
  if (props.linkToImageView) return `/gallery/images/${props.image.id}`
  if (props.linkToImageFile) return getImageUrl(props.image, props.variant)
})
const linkTarget = computed((): AnchorTarget => {
  if (props.linkToImageFile) return '_blank'
  return '_self'
})
</script>

<template>
  <div class="w-fit mx-auto shadow-lg shadow-gray-500" :class="imageRoundedClassesString(rounded)">
    <nuxt-link v-if="imageLink" :to="imageLink" :external="linkToImageFile" :target="linkTarget">
      <image-wrapper :image="image" :rounded="rounded" :variant="variant" :height-limit="imageHeightLimit" />
    </nuxt-link>
    <image-wrapper v-else :image="image" :rounded="rounded" :variant="variant" :height-limit="imageHeightLimit" />
  </div>
</template>