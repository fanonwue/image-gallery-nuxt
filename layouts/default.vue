<script setup lang="ts">
</script>

<template>
  <div>
    <Navbar id="navbar" class="sticky top-0"></Navbar>
    <div class="p-3 lg:px-5">
      <NuxtPage />
      <Footer />
    </div>
  </div>
</template>

<style scoped>
#navbar {
  z-index: 1000;
}
</style>