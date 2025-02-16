<script setup lang="ts">
import {useFetch, useRoute, computed} from "#imports";
import type {ImageDto} from "#shared/dto";

const route = useRoute()
const imageId = computed(() => route.params.id)
const apiUrl = computed(() => `/api/images/${imageId.value}`)

const { data: imageResponse } = await useFetch<ImageDto>(apiUrl)

const onSaved = async (image: ImageDto) => {
  imageResponse.value = image
}

</script>

<template>
  <div v-if="imageResponse" class="w-full">
    <image-form :image="imageResponse" @saved="onSaved" />
  </div>
  <div v-else class="text-center">
    Loading...
  </div>
</template>

<style scoped>

</style>