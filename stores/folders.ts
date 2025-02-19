import {acceptHMRUpdate, defineStore, usePinia, useAsyncData} from "#imports";
import type {FolderDto} from "#shared/dto";


export const useFoldersStore = defineStore('folders', () => {
    const fetchFolders = () => $fetch<FolderDto[]>("/api/folders", {
    })
    const foldersAsync = () => useAsyncData('folders', () => fetchFolders())

    return {
        fetchFolders, foldersAsync
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFoldersStore, import.meta.hot))
}