<script setup lang="ts">
import {appName, repositoryUrl} from "#shared";

const yearPeriod = () => {
  const startYear = 2025
  const currentYear = new Date().getFullYear()
  if (startYear == currentYear) return currentYear
  return `${startYear}-${currentYear}`
}
</script>

<template>
  <div class="mx-auto">
    <Divider />
    <a :href="repositoryUrl" target="_blank">{{ appName }} - a simple gallery manager written with Nuxt 3!</a><br>
    © {{ yearPeriod() }} Fabian Wünderich
  </div>
</template>

<style scoped>

</style>