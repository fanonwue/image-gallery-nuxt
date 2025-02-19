<script setup lang="ts">
import { ref } from "vue";
import type {MenuItem} from "primevue/menuitem";
import type {RouteRecordRaw} from "#vue-router";

interface MenuItemWithRoute extends MenuItem {
  route: string;
}

const { loggedIn, user } = useUserSession()

const loggedInItems: MenuItem[] = [
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    route: '/auth/profile'
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    route: '/auth/logout'
  }
]

const loggedOutItems: MenuItem[] = [
  {
    label: 'Login',
    icon: 'pi pi-sign-out',
    route: '/auth/login'
  }
]

const items = computed((): MenuItem[] => {

  const profileItems = loggedIn.value ? loggedInItems : loggedOutItems

  return [
    {
      separator: true
    },
    {
      label: 'Home',
      route: '/'
    },
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
      items: profileItems
    },
    {
      separator: true
    }
  ]
});
</script>

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
        <div v-if="user" class="relative overflow-hidden w-full border-0 bg-transparent p-2 pl-4 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-none transition-colors duration-200">
          <div class="text-sm">Logged in as:</div>
          <div class="font-bold">{{ user.email }}</div>

        </div>
      </template>
    </Menu>
  </aside>

</template>