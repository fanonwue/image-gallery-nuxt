<script setup lang="ts">
import {useToastWithDefaults} from "#imports";
import ImageList from "~/components/ImageList.vue";


const toast = useToastWithDefaults()

const showToast = () => {
  toast.add({
    detail: "Hello",
    summary: "Test"
  })
}



</script>

<template>
  <div>
    <image-list/>
  </div>
</template>

<style scoped>

</style>