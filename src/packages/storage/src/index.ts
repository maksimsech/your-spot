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

export async function getUrlForImageUpload(bucketName: string, file: string) {
    const key = getFileKey(file)
    const putPromise = getSignedUrl(s3, new PutObjectCommand({ Bucket: bucketName, Key: key }), { expiresIn: 30 })
    const deletePromise = getSignedUrl(s3, new DeleteObjectCommand({ Bucket: bucketName, Key: key }), { expiresIn: 45 })
    await Promise.allSettled([
        putPromise,
        deletePromise,
    ])

    const putUrl = await putPromise
    const deleteUrl = await deletePromise
    const imageUrl = getImageUrl(key)
    return {
        putUrl,
        deleteUrl,
        imageUrl,
    }
}

export async function deleteImage(imageFullUrl: string) {
    const key = regex.exec(imageFullUrl)?.at(1)
    if (!key) {
        throw new Error('Provided url isn\'t correct.')
    }

    const deleteCommand = new DeleteObjectCommand({ Bucket: imageBucketName, Key: key })

    await s3.send(deleteCommand)
}


function getImageUrl(bucketKey: string) {
    return `${publicImageUrlProtocol}://${publicImageUrlHostname}/${bucketKey}`
}

const regex = new RegExp(`^${escapeStringForRegex(publicImageUrlProtocol)}\:\/\/${escapeStringForRegex(publicImageUrlHostname)}\/(.*)$`, 'gm')

function escapeStringForRegex(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getFileKey(file: string) {
    const date = formatDate(new Date)
    return `${date}/${file}`
}

function formatDate(date: Date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0') // Adding 1 because January is 0
    const day = (date.getDate()).toString().padStart(2, '0')
    return `${year}-${month}-${day}`
}
