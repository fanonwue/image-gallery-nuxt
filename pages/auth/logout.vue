<script setup lang="ts">
import {toastWithDefault} from "#utils/client";

definePageMeta({
  middleware: ["authenticated"]
})
useHeadSafe({
  title: 'Logout'
})

const toast = useToast()
const { clear } = useUserSession()

await clear()
toastWithDefault(toast, {
  severity: "success",
  summary: "Logout successful",
  detail: `Successfully logged out`,
})
await navigateTo('/')
</script>


<style scoped>

</style>