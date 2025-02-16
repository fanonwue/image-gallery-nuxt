import type {ToastMessageOptions, ToastServiceMethods} from "primevue";

const defaultToastOptions: ToastMessageOptions = {
    life: 5000,
}
export const toastWithDefault = (toast: ToastServiceMethods, options: ToastMessageOptions) => {
    toast.add({
        ...defaultToastOptions,
        ...options,
    })
}

export const imageRoundedClasses = (rounded: boolean = true) => {
    if (rounded) return ['rounded-md']
    return []
}

export const imageRoundedClassesString = (rounded: boolean = true) => imageRoundedClasses(rounded).join(' ')