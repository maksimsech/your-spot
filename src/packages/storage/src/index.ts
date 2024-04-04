import {
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { buckets } from './buckets'
import { s3 } from './client'
import {
    imageBucketName,
    publicImageUrlHostname,
    publicImageUrlProtocol,
} from './env'


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
    return `${publicImageUrlProtocol}://${publicImageUrlHostname}/${image}`
}

const regex = new RegExp(`^${escapeStringForRegex(publicImageUrlProtocol)}\:\/\/${escapeStringForRegex(publicImageUrlHostname)}\/(.*)$`, 'gm')
export async function deleteImage(imageFullUrl: string) {
    const key = regex.exec(imageFullUrl)?.at(1)
    if (!key) {
        throw new Error('Provided url isn\'t correct.')
    }

    const deleteCommand = new DeleteObjectCommand({ Bucket: imageBucketName, Key: key })

    await s3.send(deleteCommand)
}

function escapeStringForRegex(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
