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
import {
    type Toast,
    useToast,
} from '@/components/ui/toast'

import {
    deleteImage,
    uploadImage,
} from './image'
import { formSchema } from './schema'


interface UseSportFormParameters {
    showImageInput: boolean
    spot?: Spot
    lat?: number
    lng?: number
}

export function useSpotForm({
    showImageInput,
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

    async function handleEdit(
        values: z.infer<typeof formSchema>,
        editMethod: (imageUrl?: string) => Promise<void>,
        toastArgs: Toast,
    ) {
        const { image } = values
        if (showImageInput && image && image instanceof File) {
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
                await editMethod(imageUrl)
            }
            catch (e: unknown) {
                showErrorToast()
                await deleteImage(deleteUrl)
                return false
            }
        }
        else {
            await editMethod()
        }

        toast(toastArgs)

        return true
    }

    async function handleFormSubmit(values: z.infer<typeof formSchema>) {
        let success = false
        if (spot) {
            success = await handleEdit(
                values,
                (imageUrl) => updateSpot({
                    id: spot.id,
                    title: values.title,
                    description: values.description,
                    authorId: spot.authorId,
                    image: imageUrl,
                }),
                {
                    title: `${values.title} got updated!`,
                },
            )
        } else {
            if (!lat || !lng) {
                router.push('/')
                return
            }
            success = await handleEdit(
                values,
                (imageUrl) => createSpot({
                    title: values.title,
                    description: values.description,
                    image: imageUrl,
                    coordinate: {
                        lat,
                        lng,
                    },
                }),
                {
                    title: `${values.title} created!`,
                    description: 'Thanks for new place. :)',
                },
            )
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
