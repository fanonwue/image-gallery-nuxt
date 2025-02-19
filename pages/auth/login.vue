<script setup lang="ts">
import type {LoginRequest} from "#shared/dto";
import {acceptedFileTypesString} from "#shared";
import {Form} from "@primevue/forms";
import {toastWithDefault, useToast} from "#imports";
import CardHeader from "~/components/CardHeader.vue";

definePageMeta({
  middleware: ["guest"]
})

const { loggedIn, user, fetch: refreshSession } = useUserSession()
const toast = useToast()
const isBusy = ref(false)

const credentials: LoginRequest = reactive({
  identifier: "",
  password: ""
})

const doLogin = async () => {
  try {
    isBusy.value = true;
    await $fetch("/api/auth/login", {
      method: "POST",
      body: credentials
    })
    await refreshSession()
    toastWithDefault(toast, {
      severity: "success",
      summary: "Login successful",
      detail: `Successfully logged in as ${user.value?.email}`,
    })
    await navigateTo('/')
  } catch (error) {
    toastWithDefault(toast, {
      severity: "error",
      summary: "Login failed",
      detail: "Invalid credentials?",
    })
    console.error(error)
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <Card class="w-full md:w-3/4 mx-auto">
    <template #title>
      <CardHeader>
        Login
      </CardHeader>
    </template>
    <template #content>
      <Form>
        <float-label variant="in">
          <input-text fluid id="identifier" v-model="credentials.identifier" />
          <label for="identifier">Username or email</label>
        </float-label>
        <float-label variant="in" class="mt-3">
          <Password fluid id="password" v-model="credentials.password" toggleMask :feedback="false" />
          <label for="password">Password</label>
        </float-label>
        <Divider />
        <Button fluid label="Login" type="submit" :loading="isBusy" @click="doLogin"></Button>
      </Form>
    </template>
  </Card>

</template>

<style scoped>

</style>