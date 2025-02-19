<script setup lang="ts">
import {Form} from "@primevue/forms";
import {type ImageDto, type ImageVariant, imageVariants} from "#shared/dto";
import {acceptedFileTypesString} from "#shared"
import {$fetch, type FetchOptions} from "ofetch";
import {toastWithDefault, useToast, computed, useFoldersStore} from "#imports";
import CardHeader from "~/components/CardHeader.vue";
import type {FileUploadSelectEvent} from "primevue";

const toast = useToast()

const props = defineProps<{
  image?: ImageDto
}>()

const emit = defineEmits<{
  (e: 'saved', image: ImageDto): void,
  (e: 'deleted', imageId: ImageDto['id']): void
}>()

const headerText = computed(() => {
  if (!props.image) return "Creating new image"
  return `Editing image ${props.image.id}`
})

const foldersStore = useFoldersStore()
const { data: folders, refresh: refreshFolders } = await foldersStore.foldersAsync()
const file = ref<File|undefined>()
const fileSrc = ref<string|undefined>()
const isBusy = ref(false)
const isLoading = ref(true)
const variants = [...imageVariants]
const imageVariant = ref<ImageVariant>("original")
const defaultImage = ref<ImageDto>({
  title: "",
  description: "",
  id: -1,
  externalId: "",
  folderIds: []
})

const localImage = computed(() => {
  if (props.image) return props.image
  return defaultImage.value
})

const generateFetchOptions = (): FetchOptions<"json", any> => {
  const stringifiedBody = JSON.stringify(localImage.value)
  if (file.value) {
    // We have to do a multipart request here
    const data = new FormData()

    data.append("meta", stringifiedBody)
    data.append("file", file.value)

    return {
      body: data
    }
  } else {
    return {
      body: stringifiedBody
    }
  }
}

const onSave = async () => {
  try {
    isBusy.value = true
    const fetchOptions = generateFetchOptions()
    if (localImage.value!!.id > 0) {
      fetchOptions.method = "PATCH"
    } else {
      fetchOptions.method = "PUT"
    }

    const response = await $fetch<ImageDto>("/api/images", fetchOptions)
    if (!response) if (!response) throw Error('No image returned from API')
    toastWithDefault(toast, {
      summary: "Successfully saved image",
      detail: `Image ${response.id} was saved`,
      severity: "success"
    })
    emit('saved', response)
  } catch (e: unknown) {
    toastWithDefault(toast, {
      summary: "Failed to save image",
      detail: "An error occurred while saving image",
      severity: "error",
    })
  } finally {
    isBusy.value = false
  }
}

const onDelete = async () => {
  try {
    isBusy.value = true
    const confirmResult = confirm("Are you sure you want to delete this image?")
    if (!confirmResult) return
    const imageId = localImage.value.id
    await $fetch(`/api/images/${imageId}`, {
      method: "DELETE",
    })
    toastWithDefault(toast, {
      summary: "Successfully deleted image",
      detail: `Image ${imageId} was deleted`,
      severity: "success"
    })
    emit('deleted', imageId)
  } catch (_: unknown) {
    toastWithDefault(toast, {
      summary: "Failed to delete image",
      detail: "An error occurred while deleting image",
      severity: "error",
    })
  } finally {
    isBusy.value = false
  }
}

const onFileSelect = async (e: FileUploadSelectEvent) => {
  if (!Array.isArray(e.files)) return
  const selectedFile = e.files[0]
  if (!(selectedFile instanceof File)) return
  file.value = selectedFile

  const reader = new FileReader();

  reader.onload = async (e) => {
    fileSrc.value = (e.target?.result ?? undefined) as string | undefined;
  };

  reader.readAsDataURL(selectedFile);
}

const onFileClear = async () => {
  file.value = undefined
  fileSrc.value = undefined
}

onBeforeMount(async () => {

})
</script>

<template>
  <Button @click="refreshFolders">Refresh Folders</Button>
  <Card>
    <template #title>
      <CardHeader>
        {{ headerText }}
      </CardHeader>
    </template>
    <template #content>
      <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Form>
            <float-label variant="in">
              <input-text class="w-full" id="title" v-model="localImage.title" />
              <label for="title">Title</label>
            </float-label>
            <float-label variant="in" class="mt-3">
              <Textarea class="w-full" id="description" v-model="localImage.description" rows="5" />
              <label for="description">Description</label>
            </float-label>
            <div class="mt-3">
              <Divider />
              <label for="file-upload">Upload a new file</label>
              <FileUpload id="file-upload" mode="basic" :file-limit="1" custom-upload @select="onFileSelect" @clear="onFileClear" :accept="acceptedFileTypesString"></FileUpload>
              <picture>
                <img v-if="fileSrc" :src="fileSrc!!" alt="Image" class="shadow-md rounded-xl w-full sm:w-64 mx-auto" style="filter: grayscale(100%)" />
              </picture>
            </div>
            <Divider />
              <float-label variant="in">
                <MultiSelect id="folder-select" filter  v-model="localImage.folderIds" :options="folders ?? []" option-label="name" option-value="id" class="w-full" />
                <label for="folder-select">Folders</label>
              </float-label>
            <Divider />
            <ButtonGroup class="w-full mt-3">
              <Button class="w-full" label="Save" type="submit" :loading="isBusy" @click="onSave"></Button>
              <Button class="w-full" v-if="image" label="Delete" type="button" :loading="isBusy" @click="onDelete" severity="danger"></Button>
            </ButtonGroup>
          </Form>
        </div>
        <div v-if="image" class="">
          <image-display class="max-h-screen" :image="image" :variant="imageVariant" />
          <div class="flex justify-center mt-5">
            <SelectButton v-model="imageVariant" :options="variants" :allow-empty="false"></SelectButton>
          </div>
        </div>
        <div v-else class="flex items-center justify-center">
          Upload your image to see a preview
        </div>
      </div>
    </template>
  </Card>

</template>

<style scoped>

</style>