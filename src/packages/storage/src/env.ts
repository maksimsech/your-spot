const apiUrl = process.env.STORAGE_ACCOUNT_API_URL!
const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID!
const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY!
const imageBucketName = process.env.STORAGE_IMAGE_BUCKET!
const publicImageUrlProtocol = process.env.STORAGE_PUBLIC_IMAGE_URL_PROTOCOL!
const publicImageUrlHostname = process.env.STORAGE_PUBLIC_IMAGE_URL_HOSTNAME!
if (!accessKeyId || !secretAccessKey || !imageBucketName || !publicImageUrlProtocol || !publicImageUrlHostname || !apiUrl) {
    throw new Error('Provide all env variables for S3 storage.')
}


export {
    accessKeyId,
    secretAccessKey,
    imageBucketName,
    publicImageUrlProtocol,
    publicImageUrlHostname,
    apiUrl,
}
