<script setup lang="ts">
import {useToastWithDefaults} from "#utils/toast-with-defaults";

definePageMeta({
  middleware: ["authenticated"]
})
useHeadSafe({
  title: 'Logout'
})

const toast = useToastWithDefaults()
const { clear } = useUserSession()

await clear()
toast.add({
  severity: "success",
  summary: "Logout successful",
  detail: `Successfully logged out`,
})
await navigateTo('/')
</script>


<style scoped>

</style>