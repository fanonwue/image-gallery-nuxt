import {createMissingThumbnails} from "$server/lib/thumbnail";
import {imageVariants} from "#shared/dto";
import {bytesToBase64, ensurePathExists, randomBytes} from "#utils/server";
import {imageBasePath} from "$server/lib/image-utils";

export default defineNitroPlugin(async (nitroApp) => {
    console.log('Ensuring image paths in data directory exist')

    await Promise.all(
        imageVariants.map(variant => ensurePathExists(imageBasePath(variant)))
    )

    if (!process.env.NUXT_SESSION_PASSWORD) {
        console.warn('NUXT_SESSION_PASSWORD not set. Defaulting to random string. Please set this explicitly, as sessions will be invalid after a restart!')
        const pass = bytesToBase64(randomBytes(32))
        process.env.NUXT_SESSION_PASSWORD = pass
        console.log("Generated session password:", pass)
    }

})