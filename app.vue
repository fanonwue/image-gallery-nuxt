<script setup lang="ts">
import {appName} from "#shared";

useHead({
  titleTemplate: (title?: string): string => {
    if (!title) return appName;
    return `${title} - ${appName}`;
  },
})
</script>

<template>
  <div>
    <Toast />
    <NuxtLayout />
  </div>
</template>