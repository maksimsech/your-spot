'use client'

import {
    imageTypes,
    type Spot,
} from '@your-spot/contracts'

import { Button } from '@/components/ui/button'
import { Dropzone } from '@/components/ui/dropzone'
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
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'

import { DeleteDialog } from './delete-dialog'
import {
    useSpotForm,
    maxFileSizeInMb,
} from './use-spot-form'


interface SpotFormProps {
    spot?: Spot
    showDeleteButton?: boolean
    lat?: number
    lng?: number
}

export function SpotForm({
    spot,
    showDeleteButton = false,
    lat,
    lng,
}: SpotFormProps) {
    const {
        form,
        loadingProgress,
        handleSubmit,
    } = useSpotForm({
        spot,
        lat,
        lng,
    })

    const title = spot ? 'Edit spot' : 'New spot'

    const showImageInput = !spot
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
                                    <Textarea
                                        placeholder='Description'
                                        {...field}
                                        disabled={field.disabled || isSubmitting}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Spot description.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {showImageInput && (
                        <>
                            <FormField
                                control={form.control}
                                name='image'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <Dropzone
                                                onBlur={field.onBlur}
                                                disabled={field.disabled || isSubmitting}
                                                name={field.name}
                                                maxFileSizeInMb={maxFileSizeInMb}
                                                acceptedTypes={imageTypes}
                                                onFilesChange={files => {
                                                    field.onChange(files.at(0))
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Progress value={loadingProgress} />
                        </>
                    )}
                    <Button
                        className='mt-2 self-center'
                        size='lg'
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
