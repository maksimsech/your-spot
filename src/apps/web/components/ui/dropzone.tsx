'use client'

import {
    type InputHTMLAttributes,
    useState,
    useCallback,
    useMemo,
} from 'react'

import { Cross1Icon } from '@radix-ui/react-icons'
import {
    type Accept,
    useDropzone,
} from 'react-dropzone'

import { Button } from './button'


interface DropzoneProps extends InputHTMLAttributes<HTMLInputElement> {
    onFilesChange: (files: Array<File>) => void
    maxFileSizeInMb?: number
    acceptedTypes: Record<string, ReadonlyArray<string>>
}

interface ListFile {
    file: File
    id: number
}

export function Dropzone({
    disabled,
    onFilesChange,
    name,
    id,
    onBlur,
    maxFileSizeInMb,
    acceptedTypes,
    ...restProps
}: DropzoneProps) {
    const [toUpload, setToUpload] = useState<ReadonlyArray<ListFile>>([])
    const onDrop = useCallback((files: File[]) => {
        onFilesChange(files)
        setToUpload(files.map(f => ({
            file: f,
            id: Math.random(),
        })))
    }, [onFilesChange])

    const {
        getRootProps,
        getInputProps,
    } = useDropzone({
        disabled,
        accept: acceptedTypes as Accept,
        maxFiles: 1,
        onDrop,
    })

    const acceptedFileTypes = useMemo(
        () => [...new Set(Object.values(acceptedTypes).flat())].join(', '),
        [acceptedTypes],
    )

    return (
        <div className='flex flex-col gap-2'>
            <div
                {...getRootProps({ onBlur })}
                className='border-input flex flex-col items-center gap-2 rounded-md border bg-transparent p-4 shadow-sm disabled:opacity-50'
            >
                <span className=''>
                    Click or drop file
                </span>
                <span className='text-muted-foreground text-sm'>
                    Accepted file types: {acceptedFileTypes}
                </span>
                {maxFileSizeInMb && (
                    <span className='text-muted-foreground text-sm'>
                    Maximum size is {maxFileSizeInMb} MB
                    </span>
                )}
                <input
                    {...restProps}
                    {...getInputProps({ name, id })}
                />
            </div>
            {!!toUpload.length && (
                <ul>
                    {toUpload.map((f, i) => (
                        <li
                            key={f.id}
                            className='flex items-center justify-between p-2'
                        >
                            <span>{f.file.name}</span>
                            <Button
                                className='p-2'
                                variant='ghost'
                                onClick={() => {
                                    onDrop(toUpload.map(f => f.file).toSpliced(i, 1))
                                }}
                            >
                                <Cross1Icon />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
