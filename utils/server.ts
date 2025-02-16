import { default as crypto } from "node:crypto"
import type {MultiPartData} from "h3";
import mime from "mime";

export const calculateEtag = (data: string): string => {
    return crypto.hash("sha256", data, "base64url")
}

export const mimeTypeFromMultipartFile = (file: MultiPartData) => {
    return file.type
        ?? mime.getType(file.filename ?? "")
        ?? "application/octet-stream"
}