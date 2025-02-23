<script setup lang="ts">
import type {GetImageQuery, ImageDto, QueryResult} from "#shared/dto";
import {defaultPageSize} from "#utils";
import type {PageState} from "primevue";
import {ref, useAsyncData, useFoldersStore, computed} from "#imports";
import CardHeader from "~/components/CardHeader.vue";


const pageSizes = [10, defaultPageSize, 50, 100]
const pageSize = ref(pageSizes[0]);
const page = ref(1)
const foldersStore = useFoldersStore()
const { data: folders, refresh: refreshFolders } = await foldersStore.foldersAsync()
const selectedFolder = ref<number>(-1)
const selectedFolderQueryParam = computed(() => selectedFolder.value && selectedFolder.value > 0 ? selectedFolder.value : undefined)

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
  <Button @click="refreshFolders">Refresh Folders</Button>
  <Card>
    <template #title>
      <CardHeader>
        Your Gallery
      </CardHeader>
    </template>
    <template #content>
      <float-label variant="in">
        <FolderSelection v-model="selectedFolder" :folders="folders ?? []" />
      </float-label>
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