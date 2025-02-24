import {definePreset} from "@primeuix/styled";
import Aura from "@primevue/themes/aura";

const GalleryTheme = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '{stone.50}',
                    100: '{stone.100}',
                    200: '{stone.200}',
                    300: '{stone.300}',
                    400: '{stone.400}',
                    500: '{stone.500}',
                    600: '{stone.600}',
                    700: '{stone.700}',
                    800: '{stone.800}',
                    900: '{stone.900}',
                    950: '{stone.950}'
                }
            },
            dark: {
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}'
                }
            }
        }
    },
    components: {
        toast: {
            colorScheme: {
                dark: {
                    error: {
                        background: '{red.500}',
                        color: '{white}',
                    },
                    success: {
                        background: '{green.500}',
                        color: '{white}',
                    },
                    warn: {
                        background: '{yellow.600}',
                        color: '{white}',
                    },
                    info: {
                        background: '{blue.500}',
                        color: '{white}',
                    },
                },
            },
        },
    },
})
export default GalleryTheme;