import { z } from 'zod'

import { imageTypes } from '@your-spot/contracts'


export const maxFileSizeInMb = 5
const maxFileSize = 1024 * 1024 * maxFileSizeInMb
const allowedFileTypes = Object.keys(imageTypes)

export const formSchema = z.object({
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
    image: z
        .union([
            z.instanceof(File)
                .refine(f => f.size < maxFileSize, `Maximum file size is ${maxFileSizeInMb} MB.`)
                .refine(f => allowedFileTypes.includes(f.type), 'Allowed image formats are jpeg, png'),
            z.array(z.instanceof(File))
                .refine(f => (f.length ?? 1) === 1, 'Only one file is allowed.'),
            z.string(),
            z.null(),
        ]),
})
