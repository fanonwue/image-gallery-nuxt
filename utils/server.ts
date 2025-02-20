import { default as crypto } from "node:crypto"
import type {MultiPartData} from "h3";
import mime from "mime";
import type {PathLike} from "node:fs";
import {access, mkdir} from "node:fs/promises";

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