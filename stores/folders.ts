import {acceptHMRUpdate, defineStore, useFetch} from "#imports";
import type {FolderDto} from "#shared/dto";
import type {NuxtApp} from "#app";

// Set cache TTL to 60 seconds
const foldersTtl = 60 * 1000

export const useFoldersStore = defineStore('folders', () => {
    const lastFetch = ref<Date|undefined>()
    const foldersAsync = () => useFetch<FolderDto[]>("/api/folders", {
        onResponse: () => {
            lastFetch.value = new Date()
        },
        getCachedData: (key: string, nuxtApp: NuxtApp) => {
            const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
            if (!data || !lastFetch.value) return;

            const expirationDate = new Date(lastFetch.value)
            expirationDate.setTime(expirationDate.getTime() + foldersTtl);

            if (expirationDate.getTime() < Date.now()) {
                return
            }
            return data
        }
    })

    return {
        foldersAsync
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFoldersStore, import.meta.hot))
}
