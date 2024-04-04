import type { ReactNode } from 'react'

import type { ControllerRenderProps } from 'react-hook-form'

import { imageTypes } from '@your-spot/contracts'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { maxFileSizeInMb } from '../use-spot-form'

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
                            maxFileSizeInMb={maxFileSizeInMb}
                            acceptedTypes={imageTypes}
                            loadingProgress={loadingProgress}
                            image={image}
                            onFilesChange={files =>
                                field.onChange(files.at(0))
                            }
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
