<script setup lang="ts">
import {useFetch, useRoute, computed, navigateTo} from "#imports";
import type {ImageDto} from "#shared/dto";

const route = useRoute()
const imageId = computed(() => route.params.id)
const apiUrl = computed(() => `/api/images/${imageId.value}`)

const { data: imageResponse } = await useFetch<ImageDto>(apiUrl)

const onSaved = async (image: ImageDto) => {
  imageResponse.value = image
}

const onDelete = () => {
  return navigateTo(`/gallery/images`)
}

</script>

<template>
  <div v-if="imageResponse" class="w-full">
    <image-form :image="imageResponse" @saved="onSaved" @deleted="onDelete" />
  </div>
  <div v-else class="text-center">
    Loading...
  </div>
</template>

<style scoped>

</style>