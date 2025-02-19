export const defaultPageSize = 20
export const maxPageSize = 100

export const clampPageSize = (size: number) => Math.min(size, maxPageSize)

export const user = "0194b441-e09f-7b25-928e-66b25f8832fb"
export const currentUserId = () => user

export const queryParamToNumber = (value: string|number|undefined, defaultValue: number): number => {
    if (typeof value === "string") value = parseInt(value)
    if (!value || isNaN(value)) return defaultValue
    return value
}

export const timeout = (timeout: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, timeout))
}