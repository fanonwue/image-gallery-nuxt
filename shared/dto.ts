import {z, ZodIssueCode, ZodObject, type ZodRawShape} from "zod";
import type {FormatEnum} from "sharp";
import type from "@redocly/ajv/lib/vocabularies/jtd/type";

const parseJsonPreprocessor = (value: any, ctx: z.RefinementCtx) => {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch (e) {
            ctx.addIssue({
                code: ZodIssueCode.custom,
                message: (e as Error).message,
            });
        }
    }

    return value;
};
export const parseJson = <T extends ZodRawShape>(schema: ZodObject<T>)=> {
    return z.preprocess(parseJsonPreprocessor, schema);
}

export const ImageMetaSchema = z.record(z.string())

const ImageDataSchema = z.object({
    title: z.string(),
    description: z.string(),
    meta: ImageMetaSchema.optional()
})

export const FolderDataSchema = z.object({
    name: z.string(),
    description: z.string(),
})

const FolderId = z.number()
export const FolderSchema = FolderDataSchema.extend({
    id: FolderId,
    ownerId: z.string(),
})


export const ImageSchema = ImageDataSchema.extend({
    id: z.number(),
    externalId: z.string(),
    originalUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    mimeType: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    ownerId: z.string().optional(),
    folders: z.array(FolderSchema).optional(),
    folderIds: z.array(FolderId).optional(),
})

export const UpdateImageSchema = ImageSchema.omit({
    externalId: true,
    folders: true
}).partial()

export const UpdateImageSchemaWithId = UpdateImageSchema.required({
    id: true
})

export type UpdateImagePayloadDto = z.infer<typeof UpdateImageSchema>
export const NewImageSchema = UpdateImageSchema.omit({ id: true })



export type ImageDto = z.infer<typeof ImageSchema>



export type FolderDto = z.infer<typeof FolderSchema>

export interface QueryResult<T> {
    items: T[],
    totalCount: number,
    offset: number,
    page: number,
    pageSize: number,
}

export const GetImageQuerySchema = z.object({
    page: z.number({ coerce: true }).optional(),
    pageSize: z.number({ coerce: true }).optional(),
    folders: z.string().optional()
})

export type GetImageQuery = z.infer<typeof GetImageQuerySchema>

export const imageVariants = ['original', 'thumbnail'] as const
export type ImageVariant = typeof imageVariants[number];
export type ImageFormat = keyof FormatEnum;
export const thumbnailFormats: ImageFormat[] = ['webp']
export const defaultThumbnailFormat = thumbnailFormats[0]