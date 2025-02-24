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
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<style>
/*
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(.5rem);
}
*/
</style>