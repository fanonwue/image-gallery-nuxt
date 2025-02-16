// https://nuxt.com/docs/api/configuration/nuxt-config
import {fileURLToPath} from "node:url";
import Material from '@primevue/themes/material';

export default defineNuxtConfig({
  modules: [
      '@nuxtjs/tailwindcss',
      '@primevue/nuxt-module',
  ],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  alias: {
    "#utils": fileURLToPath(new URL('./utils/', import.meta.url)),
    "$server": fileURLToPath(new URL('./server/', import.meta.url)),
    "$shared": fileURLToPath(new URL('./shared/', import.meta.url)),
  },
  sourcemap: {
    server: true,
    client: true
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
      theme: {
        preset: Material,
      }
    }
  }
})