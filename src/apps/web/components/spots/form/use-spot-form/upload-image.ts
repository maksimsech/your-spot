import { getImageUploadDetails } from '@/actions/image'


export async function uploadImage(image: File, onImageUploading: (percent: number) => void) {
    let uploadUrl: string
    let deleteUrl: string | undefined
    let imageUrl: string | undefined
    try {
        const details = await getImageUploadDetails(image.type)
        uploadUrl = details.uploadUrl
        deleteUrl = details.deleteUrl
        imageUrl = details.imageUrl

        const xhr = new XMLHttpRequest()
        const success = new Promise((resolve) => {
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    console.log('upload progress:', event.loaded / event.total)
                    onImageUploading(event.loaded / event.total)
                }
            })

            xhr.addEventListener('loadend', () => {
                onImageUploading(1)
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
