<script setup lang="ts">
import {useToast} from "#imports";
import ImageList from "~/components/ImageList.vue";


const toast = useToast()

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