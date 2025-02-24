<script setup lang="ts">
import {appName, repositoryUrl} from "#shared";
</script>

<template>
  <div id="home-container" class="flex flex-col items-center justify-center text-center">
    <span class="text-2xl">Welcome to the {{ appName }}!</span>

    <p class="mt-5">Use the navigation menu at the top to view your Gallery, add images, add folders and much more.</p>
  </div>
</template>

<style scoped>
#home-container {
  height: 20rem;
  max-height: 100vh;
}
</style>