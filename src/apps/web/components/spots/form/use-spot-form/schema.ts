import { z } from 'zod'


const maxFileSizeInMb = 5
const maxFileSize = 1024 * 1024 * maxFileSizeInMb
export const allowedFileTypes = ['image/jpeg', 'image/png']
const allowedFileTypesErrorMessage = 'Allowed image formats are jpeg, png'

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
        .optional(
            z.instanceof(File)
                .refine(f => (f.length ?? 1) === 1, 'Only one file is allowed.')
                .refine(f => f.size < maxFileSize, `Maximum file size is ${maxFileSizeInMb} MB.`)
                .refine(f => allowedFileTypes.includes(f.type), allowedFileTypesErrorMessage),
        ),
})
