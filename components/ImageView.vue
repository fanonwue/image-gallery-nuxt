<script setup lang="ts">
import type {ImageDto} from "#shared/dto";
import {useToast} from "#imports";
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
        <image-display class="-m-4 -mt-7" :image="image" :add-link="true" />
      </template>
      <template #footer>
        <Divider></Divider>
        <p> {{ image.description }} </p>
      </template>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.image-container {
  img {
    width: 100%;
  }
}
</style>