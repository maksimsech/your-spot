import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import type { Spot } from '@your-spot/contracts'

import { getImageUploadDetails } from '@/actions/image'
import {
    createSpot,
    updateSpot,
} from '@/actions/spots'
import { useMap } from '@/components/map'
import { useToast } from '@/components/ui/toast'

import { formSchema } from './schema'


interface UseSportFormParameters {
    spot?: Spot
    lat?: number
    lng?: number
    onImageUploading: (percent: number) => void
}

export function useSpotForm({
    spot,
    lat,
    lng,
    onImageUploading,
}: UseSportFormParameters) {
    const router = useRouter()
    const { toast } = useToast()
    const map = useMap()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: spot?.title ?? '',
            description: spot?.description ?? '',
        },
    })

    async function handleFormSubmit(values: z.infer<typeof formSchema>) {
        if (spot) {
            await handleUpdateSpot(values, spot)
        } else {
            await handleCreateSpot(values)
        }

        map?.refreshSpots()
        router.push('/')
    }

    async function handleUpdateSpot(values: z.infer<typeof formSchema>, spot: Spot) {
        await updateSpot({
            ...spot,
            title: values.title,
            description: values.description,
        })

        toast({
            title: `${values.title} got updated!`,
        })
    }

    async function handleCreateSpot(values: z.infer<typeof formSchema>) {
        // TODO: create job that weekly will check for image that are in cloudflare but not in db. (Or create better solution overall)

        const { image } = values
        if (image) {
            let uploadUrl: string
            let deleteUrl: string | undefined
            try {
                const details = await getImageUploadDetails(image.type)
                uploadUrl = details.uploadUrl
                deleteUrl = details.deleteUrl
                const { imageUrl } = details

                const xhr = new XMLHttpRequest()
                const success = new Promise((resolve) => {
                    xhr.upload.addEventListener('progress', (event) => {
                        if (event.lengthComputable) {
                            console.log('upload progress:', event.loaded / event.total)
                        }
                    })

                    // TODO: Not needed.
                    xhr.addEventListener('progress', (event) => {
                        if (event.lengthComputable) {
                            console.log('download progress:', event.loaded / event.total)
                        }
                    })

                    xhr.addEventListener('loadend', () => {
                        resolve(xhr.readyState === 4 && xhr.status === 200)
                    })
                    xhr.open('PUT', uploadUrl, true)
                    xhr.setRequestHeader('Content-Type', image.type)
                    xhr.send(image)
                })

                if (!success) {
                    // TODO: Show error message
                    return
                }

                await createSpot({
                    title: values.title,
                    description: values.description,
                    image: imageUrl,
                    coordinate: {
                        lat: lat!,
                        lng: lng!,
                    },
                })
            }
            catch {
                if (deleteUrl) {
                    // TODO: Show error message
                    await fetch(deleteUrl, {
                        method: 'DELETE',
                    })
                }
                // console.log(uploadUrl)
                return
            }
        }
        else {
            await createSpot({
                title: values.title,
                description: values.description,
                coordinate: {
                    lat: lat!,
                    lng: lng!,
                },
            })
        }

        toast({
            title: `${values.title} created!`,
            description: 'Thanks for new place. :)',
        })
    }

    return {
        form,
        handleSubmit: form.handleSubmit(handleFormSubmit),
    }
}
