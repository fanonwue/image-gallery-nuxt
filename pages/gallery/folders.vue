<script setup lang="ts">
import {ref, toastWithDefault, useFoldersStore} from "#imports";
import type {FolderUpdateDto} from "#shared/dto";
import {$fetch} from "ofetch";

const toast = useToast()
const foldersStore = useFoldersStore()
const { data: folders, refresh: refreshFolders, status: foldersStatus } = await foldersStore.foldersAsync()
const selectedFolder = ref<number|undefined>()
const defaultFolder: FolderUpdateDto = {
  id: -1,
  name: '',
  description: ''
}
const localFolder = ref<FolderUpdateDto>(Object.assign({}, defaultFolder))

const updateLocalFolder = () => {
  console.log("update local folder")
  if (folders.value === null) return undefined
  console.log("update local folder 2")
  const selected = folders.value?.find((f) => f.id === selectedFolder.value)
  console.log("update local folder 3")
  if (!selected) return Object.assign({}, defaultFolder)
  console.log("update local folder 4")
  return Object.assign({}, selected)
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
    toastWithDefault(toast, {
      summary: "Successfully saved folder",
      detail: `Folder ${response.id} was saved`,
      severity: "success"
    })
    await refreshFolders()
    selectedFolder.value = response.id
  } catch (e: unknown) {
    toastWithDefault(toast, {
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
    toastWithDefault(toast, {
      summary: "Successfully deleted folder",
      detail: `Folder ${folder.id} was deleted`,
      severity: "success"
    })
    await refreshFolders()
    selectedFolder.value = undefined
  } catch (e: unknown) {
    toastWithDefault(toast, {
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
  <Card>
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
        <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
          <float-label variant="in">
            <input-text class="w-full" id="name" v-model="localFolder.name" />
            <label for="name">Name</label>
          </float-label>
          <float-label variant="in">
            <input-text class="w-full" id="description" v-model="localFolder.description" />
            <label for="description">Description</label>
          </float-label>
        </div>
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