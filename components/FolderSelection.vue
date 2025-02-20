<script setup lang="ts">
import {computed} from "#imports";
import type {FolderDto} from "#shared/dto";

const props = withDefaults(defineProps<{
  folders: FolderDto[]
  label?: string,
  defaultName?: string,
  addDefault?: boolean,
}>(), {
  label: 'Folder',
  defaultName: 'All',
  addDefault: true,
})

const model = defineModel<number|undefined>()
interface FoldersOptions { title: string, value: number|undefined } {}
const foldersOptions = computed(() => {
  const options: FoldersOptions[] = []
  if (props.addDefault)
      options.push({ title: props.defaultName, value: -1 })
  props.folders.forEach(item => {
    options.push({ title: item.name, value: item.id })
  })
  return options
})

</script>

<template>
  <float-label variant="in">
    <Select id="folder-select" v-model="model"
            :options="foldersOptions" option-label="title" option-value="value"
            checkmark fluid filter :show-clear="!addDefault" filter-placeholder="Search folder"/>
    <label for="folder-select">{{ label }}</label>
  </float-label>
</template>

<style scoped>

</style>