'use server'

import { imageTypes } from '@your-spot/contracts'
import {
    buckets,
    getUploadUrl,
    getImageFullUrl,
} from '@your-spot/storage'

import { ensureAuthenticated } from '@/auth/helper'


export async function getImageUploadDetails(originalFileName: string, mimeType: string) {
    await ensureAuthenticated()

    const imageId = crypto.randomUUID()
    const originalFileExtension = originalFileName.split('.').pop()
    const extension = `.${originalFileExtension}` || getExtension(mimeType)
    const image = `${imageId}${extension}`

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

function getExtension(mime: string) {
    const mimeExtensions = (imageTypes as Record<string, ReadonlyArray<string>>)[mime]
    if (!mimeExtensions) {
        throw new Error('Unknown mime type')
    }

    return mimeExtensions[0]
}
