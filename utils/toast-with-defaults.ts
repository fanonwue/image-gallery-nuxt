import type {ToastMessageOptions, ToastServiceMethods} from "primevue";

const defaultToastOptions: ToastMessageOptions = {
    life: 5000,
}

export const useToastWithDefaults = (): ToastServiceMethods => {
    const baseToast = useToast()
    return {
        add(options: ToastMessageOptions) {
            baseToast.add({
                ...defaultToastOptions,
                ...options,
            })
        },
        remove: baseToast.remove,
        removeGroup: baseToast.removeGroup,
        removeAllGroups: baseToast.removeAllGroups
    }
}