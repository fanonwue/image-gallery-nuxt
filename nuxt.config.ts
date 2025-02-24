// https://nuxt.com/docs/api/configuration/nuxt-config
import {fileURLToPath} from "node:url";
import Aura from '@primevue/themes/aura';
import {definePreset} from "@primeuix/styled";

const GalleryTheme = definePreset(Aura, {

})

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    'nuxt-auth-utils',
    '@nuxt/icon'
  ],
  app: {
    // pageTransition: { name: 'page', mode: 'out-in' }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  alias: {
    "#utils": fileURLToPath(new URL('./utils/', import.meta.url)),
    "$server": fileURLToPath(new URL('./server/', import.meta.url)),
    "$shared": fileURLToPath(new URL('./shared/', import.meta.url)),
  },
  css: [
      '~/assets/css/main.scss',
  ],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    // and more...
  },
  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: GalleryTheme,
      }
    }
  }
})