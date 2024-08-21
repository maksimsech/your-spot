import type { ReactNode } from 'react'

import type { ControllerRenderProps } from 'react-hook-form'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import { ImageInput } from './image-input'


interface FormContainerProps {
    loadingProgress: number
    disabled?: boolean
    image?: ReactNode
    onReset?: () => void
}

export function FormContainer({
    loadingProgress,
    disabled,
    image,
    onReset,
}: FormContainerProps) {
    return (
        <FormField
            // TODO: This input is internal spot form component so good and extensible isn't big priority,
            // but it may be refactored in future.
            name='image'
            render={({ field }: { field: ControllerRenderProps<{ image?: File | string }>}) => (
                <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                        <ImageInput
                            value={field.value}
                            onBlur={field.onBlur}
                            disabled={field.disabled || disabled}
                            name={field.name}
                            loadingProgress={loadingProgress}
                            image={image}
                            onFilesChange={files => {
                                if (files.length > 1) {
                                    field.onChange(files)
                                } else {
                                    field.onChange(files.at(0))
                                }
                            }}
                            onEdit={() => field.onChange(null)}
                            onReset={onReset}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
