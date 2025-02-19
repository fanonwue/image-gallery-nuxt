<script setup lang="ts">
import type {UpdateUserDto, UserDto} from "#shared/dto";
import {watch} from "#imports";
import {$fetch} from "ofetch";
import {Form} from "@primevue/forms";
import CardHeader from "~/components/CardHeader.vue";

definePageMeta({
  middleware: ["authenticated"],
})

const { user } = useUserSession()

const { data: currentUser, refresh: refreshUser } = await useFetch<UserDto>(`/api/users/${user.value!.id}`)

const isBusy = ref(false)
const userUpdate = ref<UpdateUserDto>({

})
watchEffect(() => {
  if (!currentUser.value) return
  userUpdate.value.username = currentUser.value.username
  userUpdate.value.email = currentUser.value.email
})
const onSave = async () => {
  try {
    isBusy.value = true
    await $fetch(`/api/users/${user.value!.id}`, {
      method: "PATCH",
      body: userUpdate.value,
    })
    await refreshUser()
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <Button label="Refresh" @click="refreshUser"></Button>
  <Card class="w-full md:w-3/4 mx-auto">
    <template #title>
      <CardHeader>
        Edit Profile of {{ currentUser?.email }}
      </CardHeader>
    </template>
    <template #content>
      <Form>
        <float-label variant="in">
          <input-text fluid id="username" v-model="userUpdate.username" />
          <label for="username">Username</label>
        </float-label>
        <float-label variant="in" class="mt-3">
          <input-text fluid id="email" v-model="userUpdate.email" />
          <label for="email">Email</label>
        </float-label>
        <float-label variant="in" class="mt-3">
          <Password v-tooltip.bottom="'Leave this field empty if you do not wish to update your password'" fluid id="password" v-model="userUpdate.password" toggleMask />
          <label for="password">Password</label>
        </float-label>
        <Divider />
        <Button fluid label="Save" type="submit" :loading="isBusy" @click="onSave"></Button>
      </Form>
    </template>
  </Card>
</template>

<style scoped>

</style>