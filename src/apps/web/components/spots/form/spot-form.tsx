'use client'

import type { ReactNode } from 'react'

import type { Spot } from '@your-spot/contracts'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { DeleteDialog } from './delete-dialog'
import { ImageInput } from './image-input'
import { useSpotForm } from './use-spot-form'


export interface SpotFormProps {
    spot?: Spot
    showDeleteButton?: boolean
    lat?: number
    lng?: number
    image?: ReactNode
}

export function SpotForm({
    spot,
    showDeleteButton = false,
    lat,
    lng,
    image,
}: SpotFormProps) {
    const {
        form,
        loadingProgress,
        handleSubmit,
        handleResetImage,
    } = useSpotForm({
        spot,
        lat,
        lng,
    })

    const title = spot ? 'Edit spot' : 'New spot'

    const { isSubmitting } = form.formState

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex items-center justify-between'>
                <h2>{title}</h2>
                {showDeleteButton && spot && (
                    <DeleteDialog
                        id={spot.id}
                        title={spot.id}
                    />
                )}
            </div>
            <Form
                {...form}
            >
                <form
                    className='flex flex-col gap-2'
                    onSubmit={handleSubmit}
                >
                    <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Title'
                                        {...field}
                                        disabled={field.disabled || isSubmitting}
                                    />
                                </FormControl>
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
                                    <Textarea
                                        placeholder='Description'
                                        {...field}
                                        disabled={field.disabled || isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ImageInput
                        loadingProgress={loadingProgress}
                        disabled={isSubmitting}
                        image={image}
                        onReset={handleResetImage}
                    />
                    <Button
                        className='mt-3 w-full self-center'
                        type='submit'
                        disabled={isSubmitting}
                    >
                        Save
                    </Button>
                </form>
            </Form>
        </div>
    )
}
