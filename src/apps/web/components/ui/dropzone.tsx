'use client'

import {useCallback} from 'react'

import { useDropzone } from 'react-dropzone'


const maxFileSizeInMb = 5
const maxFileSize = 1024 * 1024 * maxFileSizeInMb

interface DropzoneProps {
    disabled?: boolean
    onChange: (files: File[]) => void
}

export function Dropzone({
    disabled,
    onChange,
}: DropzoneProps) {
    const onDrop = useCallback((files: File[]) => onChange(files), [onChange])

    const {
        getRootProps,
        getInputProps,
    } = useDropzone({
        disabled,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg', '.png'],
            'image/png': ['.png'],
        },
        maxFiles: 1,
        maxSize: maxFileSize,
        onDrop,
    })

    return (
        <div {...getRootProps()}>
            <input
                {...getInputProps}
            />
        </div>
    )
}
