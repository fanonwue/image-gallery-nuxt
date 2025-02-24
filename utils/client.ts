export const imageRoundedClasses = (rounded: boolean = true) => {
    if (rounded) return ['rounded-md']
    return []
}

export const imageRoundedClassesString = (rounded: boolean = true) => imageRoundedClasses(rounded).join(' ')