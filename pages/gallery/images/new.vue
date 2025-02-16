<script setup lang="ts">
import type {ImageDto} from "#shared/dto";
import {navigateTo} from "#imports";

const onSaved = (image: ImageDto) => {
  if (image.id > 0) navigateTo(`/gallery/images/${image.id}`)
}

</script>

<template>
  <image-form @saved="onSaved" />
</template>

<style scoped>

</style>