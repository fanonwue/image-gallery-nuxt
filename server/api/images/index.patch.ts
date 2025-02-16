import {createError, eventHandler} from "#imports";
import {ImageDto, UpdateImageSchema} from "~/shared/dto";
import {patchHandler, updateImage} from "~/server/api/images/image-operations";

export default eventHandler(async (event): Promise<ImageDto> => {
    return patchHandler(event)
})