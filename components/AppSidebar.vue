
<template>
  <aside class="h-screen sticky top-0 w-64">

        <Menu :model="items" class="h-full w-full md:w-60">
          <template #start>
            <div class="my-2 font-bold text-center">Gallery Manager</div>
          </template>
          <template #item="{ item, props }">
            <nuxt-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
              </a>
            </nuxt-link>
            <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </template>
          <template #end>
            <button v-ripple class="relative overflow-hidden w-full border-0 bg-transparent flex items-start p-2 pl-4 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-none cursor-pointer transition-colors duration-200">
              <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" class="mr-2" shape="circle" />
              <span class="inline-flex flex-col items-start">
                <span class="font-bold">Amy Elsner</span>
                <span class="text-sm">Admin</span>
            </span>
            </button>
          </template>
        </Menu>
  </aside>

</template>

<script setup lang="ts">
import { ref } from "vue";
import type {MenuItem} from "primevue/menuitem";
import type {RouteRecordRaw} from "#vue-router";

interface MenuItemWithRoute extends MenuItem {
  route: string;
}

const items = ref<MenuItem[]>([
  {
    separator: true
  },
  {
    label: 'Gallery',
    items: [
      {
        label: 'View',
        icon: 'pi pi',
        route: '/gallery/images'
      },
      {
        label: 'New',
        icon: 'pi pi-plus',
        route: "/gallery/images/new"
      }
    ]
  },
  {
    label: 'Profile',
    items: [
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        shortcut: '⌘+O'
      },
      {
        label: 'Messages',
        icon: 'pi pi-inbox',
        badge: 2
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        shortcut: '⌘+Q'
      }
    ]
  },
  {
    separator: true
  }
]);
</script>