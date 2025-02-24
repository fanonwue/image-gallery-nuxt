<script setup lang="ts">
import {ref, useFoldersStore, useToastWithDefaults} from "#imports";
import type {FolderUpdateDto} from "#shared/dto";
import {$fetch} from "ofetch";

useHeadSafe({
  title: 'Your Folders'
})

const toast = useToastWithDefaults()
const foldersStore = useFoldersStore()
const { data: folders, refresh: refreshFolders, status: foldersStatus } = await foldersStore.foldersAsync()
const selectedFolder = ref<number|undefined>()
const defaultFolder: FolderUpdateDto = {
  id: -1,
  name: '',
  description: ''
}
const localFolder = ref<FolderUpdateDto>({...defaultFolder})

const updateLocalFolder = () => {
  if (folders.value === null) return undefined
  const selected = folders.value?.find((f) => f.id === selectedFolder.value)
  if (!selected) return {...defaultFolder}
  return {...selected}
}
const updateLocalFolderWatchers = () => {
  const newFolder = updateLocalFolder()
  if (newFolder) localFolder.value = newFolder
}
watch(folders, updateLocalFolderWatchers)
watch(selectedFolder, updateLocalFolderWatchers)

const isBusy = ref(false)
const isBusyOrRefreshing = computed(() => isBusy.value || foldersStatus.value == "pending")
const isNew = computed(() => (localFolder.value?.id ?? -1) <= 0)

const onSave = async () => {
  try {
    isBusy.value = true
    let url = '/api/folders'
    let method = 'PUT'
    const folder = localFolder.value!
    if (!isNew.value) {
      url += `/${folder.id}`
      method = 'PATCH'
    }

    const response = await $fetch(url, {
      method,
      body: JSON.stringify(folder)
    })
    if (!response) throw Error('No folder returned from API')
    toast.add({
      summary: "Successfully saved folder",
      detail: `Folder ${response.id} was saved`,
      severity: "success"
    })
    await refreshFolders()
    selectedFolder.value = response.id
  } catch (e: unknown) {
    toast.add({
      summary: "Failed to save folder",
      detail: "An error occurred while saving folder",
      severity: "error",
    })
  } finally {
    isBusy.value = false
  }
}

const onDelete = async () => {
  try {
    isBusy.value = true
    if (isNew.value) return
    const folder = localFolder.value!
    if (!confirm("Are you sure you want to delete this folder?")) return
    await $fetch(`/api/folders/${folder.id}`, {
      method: "DELETE",
    })
    toast.add({
      summary: "Successfully deleted folder",
      detail: `Folder ${folder.id} was deleted`,
      severity: "success"
    })
    await refreshFolders()
    selectedFolder.value = undefined
  } catch (e: unknown) {
    toast.add({
      summary: "Failed to delete folder",
      detail: `An error occurred while deleting folder`,
      severity: "error"
    })
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <Card class="w-full md:w-5/6 lg:w-4/6 xl:w-1/2 mx-auto">
    <template #title>
      <CardHeader>
        Folder Management
      </CardHeader>
    </template>
    <template #content>
      <p class="mb-3">Please select the folder you wish to edit. Clear the selection to create a new folder.</p>
      <FolderSelection v-model="selectedFolder" :folders="folders ?? []" :add-default="false" />
      <Form v-if="localFolder">
        <Divider />
        <float-label variant="in">
          <input-text class="w-full" id="name" v-model="localFolder.name" />
          <label for="name">Name</label>
        </float-label>
        <float-label variant="in" class="mt-3">
          <Textarea class="w-full" id="description" v-model="localFolder.description" rows="5" />
          <label for="description">Description</label>
        </float-label>
        <Divider />
        <ButtonGroup class="w-full mt-3">
          <Button class="w-full" type="submit" :loading="isBusyOrRefreshing" @click="onSave">
            {{ isNew ? "Create" : "Save" }}
          </Button>
          <Button v-if="!isNew" class="w-full" type="button" :loading="isBusyOrRefreshing"
                  @click="onDelete" severity="danger">Delete</Button>
        </ButtonGroup>

      </Form>
    </template>
  </Card>
</template>

<style scoped>

</style>