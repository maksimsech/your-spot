import {
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { buckets } from './buckets'
import { s3 } from './client'
import { publicImageUrlBase } from './env'

export { buckets }

export async function getUploadUrl(bucketName: string, file: string) {
    const putPromise = getSignedUrl(s3, new PutObjectCommand({ Bucket: bucketName, Key: file }), { expiresIn: 30 })
    const deletePromise = getSignedUrl(s3, new DeleteObjectCommand({ Bucket: bucketName, Key: file }), { expiresIn: 45 })
    await Promise.allSettled([
        getSignedUrl(s3, new PutObjectCommand({ Bucket: bucketName, Key: file }), { expiresIn: 30 }),
        getSignedUrl(s3, new DeleteObjectCommand({ Bucket: bucketName, Key: file }), { expiresIn: 45 }),
    ])

    const putUrl = await putPromise
    const deleteUrl = await deletePromise
    return {
        putUrl,
        deleteUrl,
    }
}


export function getImageFullUrl(image: string) {
    return `${publicImageUrlBase}${image}`
}
