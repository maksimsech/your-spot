'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
    useRouter,
    useSearchParams,
} from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { createSpot } from '@/actions/spots'
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


const formSchema = z.object({
    title: z
        .string()
        .min(5, {
            message: 'Title must be at least 5 characters.',
        })
        .max(15, {
            message: 'Maximum length of title is 15 characters.',
        }),
    description: z
        .string()
        .max(40, {
            message: 'Maximum length of description is 40 characters.',
        }),
})

export function SpotForm() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    })

    const lat = searchParams.get('lat') != null ? parseFloat(searchParams.get('lat')!) : null
    const lng = searchParams.get('lng') != null ? parseFloat(searchParams.get('lng')!) : null
    if (lat == null || lng == null) {
        router.back()
    }

    async function handleFormSubmit(values: z.infer<typeof formSchema>) {
        await createSpot({
            title: values.title,
            description: values.description,
            coordinate: {
                lat: lat!,
                lng: lng!,
            },
        })

        router.push('/?action=refresh') // TODO: Reload current spots
    }

    return (
        <div className='flex flex-col gap-y-6'>
            <h2>New spot</h2>
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
