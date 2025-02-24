<script setup lang="ts">
import type {MenuItem} from "primevue/menuitem";
import {appName} from "#shared";

interface MenuItemWithRoute extends MenuItem {
  route: string;
}

const navIconSize = '1.5em'
const { loggedIn, user } = useUserSession()
const expanded = ref(false)

const route = useRoute()
const isCurrentRoute = (path: string) => {
  return route.path === path
}

const loggedInItems: MenuItem[] = [
  {
    label: 'Settings',
    icon: 'material-symbols-light:settings-account-box',
    route: '/auth/profile'
  },
  {
    label: 'Logout',
    icon: 'material-symbols-light:logout',
    route: '/auth/logout'
  }
]

const loggedOutItems: MenuItem[] = [
  {
    label: 'Login',
    icon: 'material-symbols-light:login',
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
      icon: 'material-symbols-light:home-rounded',
      route: '/'
    },
    {
      separator: true
    },
    {
      label: 'Gallery',
      icon: 'material-symbols-light:gallery-thumbnail-rounded',
      items: [
        {
          label: 'View',
          icon: 'material-symbols-light:image-rounded',
          route: '/gallery/images'
        },
        {
          label: 'New',
          icon: 'material-symbols-light:add-box-rounded',
          route: "/gallery/images/new"
        },
        {
          label: 'Folders',
          icon: 'material-symbols-light:folder',
          route: "/gallery/folders"
        }
      ]
    },
    {
      label: 'Profile',
      icon: 'material-symbols-light:person-rounded',
      items: profileItems
    },
    {
      separator: true
    }
  ]
});
</script>

<template>
  <Menubar :model="items">
    <template #start>
      <div class="my-2 font-bold text-center">{{ appName }}</div>
    </template>
    <template #item="{ item, props }">
      <nuxt-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <Icon v-if="item.icon" :name="item.icon" :size="navIconSize" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </nuxt-link>
      <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
        <Icon v-if="item.icon" :name="item.icon" :size="navIconSize" />
        <span class="ml-2">{{ item.label }}</span>
      </a>
    </template>
    <template #end>
      <div v-if="user">
        <div class="text-sm">Logged in as:</div>
        <div class="font-bold">{{ user.email }}</div>
      </div>
    </template>
  </Menubar>
</template>
