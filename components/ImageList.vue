<script setup lang="ts">
import type {GetImageQuery, ImageDto, QueryResult} from "#shared/dto";
import {debugMode, defaultPageSize} from "#utils";
import type {PageState} from "primevue";
import {ref, useAsyncData, useFoldersStore, computed} from "#imports";
import CardHeader from "~/components/CardHeader.vue";


const pageSizes = [10, defaultPageSize, 50, 100]
const pageSize = ref(pageSizes[0]);
const page = ref(1)
const foldersStore = useFoldersStore()
const { data: folders, refresh: refreshFolders } = await foldersStore.foldersAsync()
const selectedFolderId = ref<number>(-1)
const selectedFolder = computed(() => {
  return folders.value?.find((f) => f.id === selectedFolderId.value)
})
const selectedFolderQueryParam = computed(() => selectedFolderId.value && selectedFolderId.value > 0 ? selectedFolderId.value : undefined)

const queryParams = computed((): GetImageQuery => {
  return {
    page: page.value,
    pageSize: pageSize.value,
    folders: selectedFolderQueryParam.value?.toString()
  }
})
const { data: imageResponse, refresh: refreshImages } = await useFetch("/api/images", {
  query: queryParams
});

const onPageEvent = (e: PageState) => {
  pageSize.value = e.rows
  page.value = e.page + 1
}

</script>

<template>
  <Button v-if="debugMode" @click="refreshFolders()">Refresh Folders</Button>
  <Card>
    <template #title>
      <CardHeader>
        Your Gallery
      </CardHeader>
    </template>
    <template #content>
      <float-label variant="in">
        <FolderSelection v-model="selectedFolderId" :folders="folders ?? []" />
      </float-label>
    </template>
    <template #footer v-if="selectedFolder?.description">
      <Divider />
      <span class="font-bold">Description</span>
      <p class="mt-2 whitespace-pre-wrap">{{ selectedFolder.description }}</p>
    </template>
  </Card>

  <paginator class="mt-3" :rows="pageSize" :total-records="imageResponse?.totalCount ?? 0"
             :rows-per-page-options="pageSizes" @page="onPageEvent" />

  <div class="columns-xs gap-y-3 mt-3">
    <image-view class="mb-3" v-if="imageResponse" v-for="image in imageResponse.items"
                :image="image" :border="true" :key="image.id" />
  </div>
</template>

<style scoped lang="scss">
</style>