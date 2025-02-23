import {acceptHMRUpdate, defineStore} from "#imports";
import type {FolderDto} from "#shared/dto";


export const useFoldersStore = defineStore('folders', () => {
    const foldersAsync = () => useFetch<FolderDto[]>("/api/folders")

    return {
        foldersAsync
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFoldersStore, import.meta.hot))
}