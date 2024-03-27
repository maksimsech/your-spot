const storageAccountId = process.env.STORAGE_ACCOUNT_ID!
const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID!
const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY!
const imageBucketName = process.env.STORAGE_IMAGE_BUCKET!
const publicImageUrlBase = process.env.STORAGE_PUBLIC_IMAGE_URL_BASE!
if (!storageAccountId || !accessKeyId || !secretAccessKey || !imageBucketName || !publicImageUrlBase) {
    throw new Error('Provide all env variables for S3 storage.')
}

export {
    storageAccountId,
    accessKeyId,
    secretAccessKey,
    imageBucketName,
    publicImageUrlBase,
}
