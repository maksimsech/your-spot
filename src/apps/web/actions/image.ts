'use server'

import {
    buckets,
    getUploadUrl,
    getImageFullUrl,
} from '@your-spot/storage'

import { ensureAuthenticated } from '@/auth/helper'


export async function getImageUploadDetails(mimeType: string) {
    await ensureAuthenticated()

    const imageId = crypto.randomUUID()
    const extension = getExtension(mimeType)
    const image = `${imageId}.${extension}`

    const {
        putUrl,
        deleteUrl,
    } = await getUploadUrl(buckets.image, image)
    const imageUrl = getImageFullUrl(image)
    return {
        uploadUrl: putUrl,
        deleteUrl,
        imageUrl,
    }
}

// TODO: Mapping only allowed from schema file. Refactor
function getExtension(mime: string) {
    switch (mime) {
    case 'image/jpeg': return 'jpeg'
    case 'image/png': return 'png'
    default: throw new Error('Unknown mime type')
    }
}
