import type {
    FocusEventHandler,
    ReactNode,
} from 'react'

import { imageTypes } from '@your-spot/contracts'

import { Button } from '@/components/ui/button'
import { Dropzone } from '@/components/ui/dropzone'
import { Progress } from '@/components/ui/progress'
import { maxFileSizeInMb } from '../use-spot-form'


interface ImageInputProps {
    name: string
    loadingProgress: number
    disabled?: boolean
    onBlur?: FocusEventHandler<HTMLInputElement>
    onFilesChange: (files: Array<File>) => void
    value?: File | string
    image?: ReactNode
    onEdit: () => void
    onReset?: () => void
}

export function ImageInput({
    name,
    loadingProgress,
    disabled,
    onBlur,
    onFilesChange,
    value,
    image,
    onEdit,
    onReset,
    ...restProps
}: ImageInputProps) {
    if (typeof value === 'string') {
        return (
            <>
                {image}
                <Button
                    className='w-full'
                    variant='outline'
                    onClick={(e) => {
                        e.preventDefault && e.preventDefault()
                        e.persist && e.persist()

                        onEdit()
                    }}
                >
                Edit
                </Button>
            </>
        )
    }

    return (
        <>
            <Dropzone
                onBlur={onBlur}
                disabled={disabled}
                name={name}
                maxFileSizeInMb={maxFileSizeInMb}
                acceptedTypes={imageTypes}
                onFilesChange={onFilesChange}
                {...restProps}
            />
            {onReset && (
                <Button
                    className='w-full'
                    variant='outline'
                    onClick={(e) => {
                        e.preventDefault && e.preventDefault()
                        e.persist && e.persist()

                        onReset()
                    }}
                >
                Reset
                </Button>
            )}
            <Progress value={loadingProgress} />
        </>
    )
}
