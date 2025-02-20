import crypto from "node:crypto"
import type {MultiPartData} from "h3";
import mime from "mime";
import type {PathLike} from "node:fs";
import {access, mkdir} from "node:fs/promises";
import {generateExternalId} from "$server/lib/image-utils";

export const randomBytes = (length: number) => crypto.randomBytes(length)
export const bytesToBase64 = (buf: Buffer|Uint8Array, urlSafe: boolean = true) => {
    if (!buf) buf = generateExternalId()
    if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
    return buf.toString(urlSafe ? 'base64url' : 'base64')
}

export const calculateEtag = (data: string): string => {
    return crypto.hash("sha256", data, "base64url")
}

export const mimeTypeFromMultipartFile = (file: MultiPartData) => {
    return file.type
        ?? mime.getType(file.filename ?? "")
        ?? "application/octet-stream"
}

export const enableQueryLogging = false

export const ensurePathExists = async (path: PathLike, recursive: boolean = true) => {
    if (!await pathExists(path)) await mkdir(path, { recursive: recursive })
}

export const pathExists = async (path: PathLike): Promise<boolean> => {
    try {
        await access(path)
        return true
    } catch (err: any) {
        if (err.code === 'ENOENT') return false
        throw err
    }
}