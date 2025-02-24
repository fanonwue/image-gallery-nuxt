<script setup lang="ts">
import type {ImageDto} from "#shared/dto";
import ImageDisplay from "~/components/ImageDisplay.vue";

const props = withDefaults(defineProps<{
  image: ImageDto,
  border?: boolean
}>(), {
  border: true
})

</script>

<template>
  <div>
    <Card class="break-inside-avoid">
      <template #header>
        <image-title :image="image" :compact="true" />
        <Divider></Divider>
      </template>
      <template #content>
        <image-display class="-m-4 -mt-7" :image="image" variant="thumbnail" :link-to-image-view="true" />
      </template>
      <template #footer>
        <Divider></Divider>
        <p class="whitespace-pre-wrap"> {{ image.description?.trim() }} </p>
      </template>
    </Card>
  </div>
</template>