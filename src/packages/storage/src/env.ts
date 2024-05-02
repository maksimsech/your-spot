import { z } from 'zod'


const envSchema = z.object({
    STORAGE_ACCOUNT_API_URL: z.string().min(1),
    STORAGE_ACCESS_KEY_ID: z.string().min(1),
    STORAGE_SECRET_ACCESS_KEY: z.string().min(1),
    STORAGE_IMAGE_BUCKET: z.string().min(1),
    STORAGE_PUBLIC_IMAGE_URL_PROTOCOL: z.string().min(1),
    STORAGE_PUBLIC_IMAGE_URL_HOSTNAME: z.string().min(1),
})

const {
    STORAGE_ACCOUNT_API_URL: apiUrl,
    STORAGE_ACCESS_KEY_ID: accessKeyId,
    STORAGE_SECRET_ACCESS_KEY: secretAccessKey,
    STORAGE_IMAGE_BUCKET: imageBucketName,
    STORAGE_PUBLIC_IMAGE_URL_PROTOCOL: publicImageUrlProtocol,
    STORAGE_PUBLIC_IMAGE_URL_HOSTNAME: publicImageUrlHostname,
} = envSchema.parse(process.env)

export {
    accessKeyId,
    secretAccessKey,
    imageBucketName,
    publicImageUrlProtocol,
    publicImageUrlHostname,
    apiUrl,
}
