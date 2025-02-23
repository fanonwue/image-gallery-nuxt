<script setup lang="ts">
import type {ImageDto} from "#shared/dto";
import {navigateTo} from "#imports";

useHeadSafe({
  title: 'Create new image'
})
const onSaved = (image: ImageDto) => {
  if (image.id > 0) navigateTo(`/gallery/images/${image.id}`)
}

</script>

<template>
  <image-form @saved="onSaved" />
</template>

<style scoped>

</style>