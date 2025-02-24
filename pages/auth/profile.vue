<script setup lang="ts">
import type {UpdateUserDto, UserDto} from "#shared/dto";
import {useToastWithDefaults} from "#imports";
import {$fetch} from "ofetch";
import {Form} from "@primevue/forms";
import CardHeader from "~/components/CardHeader.vue";
import {debugMode} from "#utils";

definePageMeta({
  middleware: ["authenticated"],
})
useHeadSafe({
  title: 'Your Profile'
})

const { user, fetch: refreshSession } = useUserSession()
const toast = useToastWithDefaults()

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
    toast.add({
      severity: "success",
      summary: "Successfully updated user information",
    })
    await Promise.all([
      refreshUser(),
      refreshSession()
    ])
  } catch (_) {
    toast.add({
      severity: "error",
      summary: "Failed to update user information",
    })
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div>
    <Button v-if="debugMode" @click="refreshUser()">Refresh User</Button>
    <Card class="w-full md:w-5/6 lg:w-4/6 xl:w-1/2 mx-auto">
      <template #title>
        <CardHeader>
          Edit Profile of {{ currentUser?.email }}
        </CardHeader>
      </template>
      <template #content>
        <Form @submit="onSave">
          <float-label variant="in">
            <input-text fluid id="username" v-model="userUpdate.username" required />
            <label for="username">Username</label>
          </float-label>
          <float-label variant="in" class="mt-3">
            <input-text fluid id="email" v-model="userUpdate.email" required type="email" />
            <label for="email">Email</label>
          </float-label>
          <float-label variant="in" class="mt-3">
            <Password v-tooltip.bottom="'Leave this field empty if you do not wish to update your password'" fluid id="password" v-model="userUpdate.password" toggleMask />
            <label for="password">Password</label>
          </float-label>
          <Divider />
          <Button fluid label="Save" type="submit" :loading="isBusy"></Button>
        </Form>
      </template>
    </Card>
  </div>
</template>

<style scoped>

</style>