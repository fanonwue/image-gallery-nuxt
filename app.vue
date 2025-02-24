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
    <Toast id="default-toast" class="" />
    <NuxtLayout />
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<style lang="scss">
$toast-border-x: 1em;
$toast-border-top: 1em;

#default-toast {
  --border-top: #{$toast-border-top};
  --border-x: #{$toast-border-x};

  position: fixed;
  top: var(--border-top) !important;
  right: var(--border-x) !important;
  max-width: calc(100vw - var(--border-x) * 2);
  
  @media screen and (min-width: 1024px) {
    --border-top: #{$toast-border-top * 2};
    --border-x: #{$toast-border-x * 2};
  }
}

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