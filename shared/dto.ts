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

export const UserSchema = z.object({
    id: z.string(),
    username: z.string(),
    email: z.string().email(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export const UpdateUserSchema = UserSchema.extend({
    password: z.string(),
}).omit({ id: true }).partial()

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>
export type UserDto = z.infer<typeof UserSchema>

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

export const FolderId = z.number({ coerce: true })
export const FolderDataWithOwnerSchema = FolderDataSchema.extend({
    ownerId: z.string(),
})
export const FolderSchema = FolderDataWithOwnerSchema.extend({
    id: FolderId,
})

export const NewFolderSchema = FolderDataSchema
export const UpdateFolderSchema = FolderSchema.omit({ ownerId: true })
export const GetFolderParams = z.object({id: FolderId})

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

export const NewImageSchema = UpdateImageSchema.omit({ id: true })

export type UpdateImagePayloadDto = z.infer<typeof UpdateImageSchema>



export type ImageDto = z.infer<typeof ImageSchema>



export type FolderDto = z.infer<typeof FolderSchema>
export type FolderUpdateDto = z.infer<typeof UpdateFolderSchema>

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

export const LoginRequestSchema = z.object({
    identifier: z.string(),
    password: z.string(),
})

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export interface LoginResponse {
    sessionId: string,
}

export const imageVariants = ['original', 'thumbnail'] as const
export type ImageVariant = typeof imageVariants[number];
export type ImageFormat = keyof FormatEnum;
export const thumbnailFormats: ImageFormat[] = ['webp']
export const defaultThumbnailFormat = thumbnailFormats[0]