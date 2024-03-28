import { getImageUploadDetails } from '@/actions/image'


type UploadImageResult =
    | {
        success: false
        deleteUrl?: string
    }
    | {
        success: true
        imageUrl: string
        deleteUrl: string
    }

export async function uploadImage(image: File, onImageUploading: (percent: number) => void): Promise<UploadImageResult> {
    let uploadUrl: string
    let deleteUrl: string | undefined
    let imageUrl: string | undefined
    try {
        const details = await getImageUploadDetails(image.type)
        uploadUrl = details.uploadUrl
        deleteUrl = details.deleteUrl
        imageUrl = details.imageUrl

        const xhr = new XMLHttpRequest()
        const success = await new Promise((resolve) => {
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    onImageUploading(event.loaded / event.total * 100)
                }
            })

            xhr.addEventListener('loadend', () => {
                onImageUploading(100)
                resolve(xhr.readyState === 4 && xhr.status === 200)
            })
            xhr.open('PUT', uploadUrl, true)
            xhr.setRequestHeader('Content-Type', image.type)

            onImageUploading(0)
            xhr.send(image)
        })

        if (!success) {
            return {
                success: false,
            }
        }
    }
    catch (e: unknown) {
        return {
            success: false,
            deleteUrl,
        }
    }

    return {
        success: true,
        imageUrl,
        deleteUrl,
    }
}

export async function deleteImage(deleteUrl: string) {
    const result = await fetch(deleteUrl, {
        method: 'DELETE',
    })

    return result.ok
}
