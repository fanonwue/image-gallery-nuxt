<script setup lang="ts">
import type {GetImageQuery, ImageDto, QueryResult} from "#shared/dto";
import {defaultPageSize} from "#utils";
import type {PageState} from "primevue";
import {ref} from "#imports";
import CardHeader from "~/components/CardHeader.vue";


const pageSizes = [10, defaultPageSize, 50, 100]
const pageSize = ref(pageSizes[0]);
const page = ref(1)

const queryParams = computed((): GetImageQuery => {
  return {
    page: page.value,
    pageSize: pageSize.value,
  }
})
const { data: imageResponse, refresh: refreshImages } = await useFetch("/api/images", {
  query: queryParams
});

const onPageEvent = (e: PageState) => {
  console.log("page event", e);
  pageSize.value = e.rows
  page.value = e.page + 1
  console.log(page.value)
}

</script>

<template>
  <Card>
    <template #content>
      <CardHeader :separator="false">
        Your Gallery
      </CardHeader>
    </template>
  </Card>

  <div class="columns-xs gap-y-3 mt-3">
    <image-view class="mb-3" v-if="imageResponse" v-for="image in imageResponse.items" :image="image" :border="true" :key="image.id"></image-view>
  </div>
  <paginator class="mt-3" :rows="pageSize" :total-records="imageResponse?.totalCount ?? 0" :rows-per-page-options="pageSizes" @page="onPageEvent" />
</template>

<style scoped lang="scss">
</style>