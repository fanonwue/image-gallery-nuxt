<script setup lang="ts">
import {repositoryUrl} from "#shared";
</script>

<template>
  <div class="flex flex-col items-center justify-center h-2/3">
    <span class="text-2xl">Welcome to the Gallery Manager!</span>

    <span><a :href="repositoryUrl" target="_blank">Click here to view the source code</a></span>
  </div>
</template>

<style scoped>

</style>