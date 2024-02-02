'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import type { Spot } from '@your-spot/contracts'

import {
    createSpot,
    updateSpot,
} from '@/actions/spots'
import {useMap} from '@/components/map'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'


const formSchema = z.object({
    title: z
        .string()
        .min(5, {
            message: 'Title must be at least 5 characters.',
        })
        .max(30, {
            message: 'Maximum length of title is 30 characters.',
        }),
    description: z
        .string()
        .max(100, {
            message: 'Maximum length of description is 100 characters.',
        }),
})

interface SpotFormProps {
    spot?: Spot
    lat?: number
    lng?: number
}

export function SpotForm({
    spot,
    lat,
    lng,
}: SpotFormProps) {
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
            await updateSpot({
                ...spot,
                title: values.title,
                description: values.description,
            })

            toast({
                title: `${values.title} got updated!`,
            })
        } else {
            await createSpot({
                title: values.title,
                description: values.description,
                coordinate: {
                    lat: lat!,
                    lng: lng!,
                },
            })

            toast({
                title: `${values.title} created!`,
                description: 'Thanks for new place. :)',
            })
        }

        map?.refreshSpots()
        router.push('/')
    }

    const title = spot ? 'Edit spot' : 'New spot'

    return (
        <div className='flex flex-col gap-y-6'>
            <h2>{title}</h2>
            <Form {...form}>
                <form
                    className='space-y-4'
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                >
                    <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder='Title' {...field} />
                                </FormControl>
                                <FormDescription>
                                    Spot title.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder='Description' {...field} />
                                </FormControl>
                                <FormDescription>
                                    Spot description.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit'>Save</Button>
                </form>
            </Form>
        </div>

    )
}
