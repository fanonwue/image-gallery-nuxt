import {createMissingThumbnails} from "$server/lib/thumbnail";
import {imageVariants} from "#shared/dto";
import {ensurePathExists} from "#utils/server";
import {imageBasePath} from "$server/lib/image-utils";

export default defineNitroPlugin(async (nitroApp) => {
    console.log('Ensuring image paths in data directory exist')

    await Promise.all(
        imageVariants.map(variant => ensurePathExists(imageBasePath(variant)))
    )
})