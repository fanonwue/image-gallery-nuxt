<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated']
})

useHeadSafe({
  title: 'Gallery'
})
</script>

<template>
<NuxtPage></NuxtPage>
</template>

<style scoped>

</style>