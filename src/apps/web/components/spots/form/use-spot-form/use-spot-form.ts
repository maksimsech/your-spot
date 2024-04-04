import {
    useMemo,
    useState,
} from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import type { Spot } from '@your-spot/contracts'

import {
    createSpot,
    updateSpot,
} from '@/actions/spots'
import { useMap } from '@/components/map'
import { useToast } from '@/components/ui/toast'

import {
    deleteImage,
    uploadImage,
} from './image'
import { formSchema } from './schema'


interface UseSportFormParameters {
    spot?: Spot
    lat?: number
    lng?: number
}

export function useSpotForm({
    spot,
    lat,
    lng,
}: UseSportFormParameters) {
    const router = useRouter()
    const { toast } = useToast()
    const map = useMap()

    const [loadingProgress, setLoadingProgress] = useState(0)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: spot?.title ?? '',
            description: spot?.description ?? '',
            image: spot?.image ?? null,
        },
    })

    function showErrorToast() {
        toast({
            title: 'Error occurred!',
            description: 'Please try again.',
        })
    }

    async function handleUpdateSpot(values: z.infer<typeof formSchema>, spot: Spot) {
        await updateSpot({
            ...spot,
            title: values.title,
            description: values.description,
        })

        const { image } = values
        if (image && image instanceof File) {
            const result = await uploadImage(image, setLoadingProgress)

            if (!result.success) {
                showErrorToast()
                const { deleteUrl } = result
                if (deleteUrl) {
                    await deleteImage(deleteUrl)
                }
                return false
            }

            const {
                imageUrl,
                deleteUrl,
            } = result

            try {
                await updateSpot({
                    id: spot.id,
                    title: values.title,
                    description: values.description,
                    authorId: spot.authorId,
                    image: imageUrl,
                })
            }
            catch (e: unknown) {
                showErrorToast()
                await deleteImage(deleteUrl)
                return false
            }
        }
        else {
            await updateSpot({
                id: spot.id,
                title: values.title,
                description: values.description,
                authorId: spot.authorId,
            })
        }

        toast({
            title: `${values.title} got updated!`,
        })

        return true
    }

    async function handleCreateSpot(values: z.infer<typeof formSchema>, lat: number, lng: number) {
        // TODO: create job that weekly will check for image that are in cloudflare but not in db. (Or create better solution overall)

        const { image } = values
        if (image && image instanceof File) {
            const result = await uploadImage(image, setLoadingProgress)

            if (!result.success) {
                showErrorToast()
                const { deleteUrl } = result
                if (deleteUrl) {
                    await deleteImage(deleteUrl)
                }
                return false
            }

            const {
                imageUrl,
                deleteUrl,
            } = result

            try {
                await createSpot({
                    title: values.title,
                    description: values.description,
                    image: imageUrl,
                    coordinate: {
                        lat,
                        lng,
                    },
                })
            }
            catch (e: unknown) {
                showErrorToast()
                await deleteImage(deleteUrl)
                return false
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

        return true
    }

    async function handleFormSubmit(values: z.infer<typeof formSchema>) {
        let success = false
        if (spot) {
            success = await handleUpdateSpot(values, spot)
        } else {
            if (!lat || !lng) {
                router.push('/')
                return
            }
            success = await handleCreateSpot(values, lat, lng)
        }

        if (success) {
            map?.refreshSpots()
            router.push('/')
        }
    }

    const handleResetImage = useMemo(
        () => spot?.image
            ? () => form.resetField('image')
            : undefined,
        [form, spot],
    )

    return {
        form,
        loadingProgress,
        handleSubmit: form.handleSubmit(handleFormSubmit),
        handleResetImage,
    }
}
