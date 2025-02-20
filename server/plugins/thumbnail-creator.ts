import {createMissingThumbnails} from "$server/lib/thumbnail";

export default defineNitroPlugin(async (nitroApp) => {
    console.log('Registering thumbnail creation task')

    const interval = 10 * 60 * 1000 // 10 minutes
    const id = setInterval(async () => {
        await createMissingThumbnails()
    }, interval)
})