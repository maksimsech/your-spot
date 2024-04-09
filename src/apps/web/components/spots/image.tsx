import Image from 'next/image'

import { cn } from '@/utils'
import { isMobileClient } from '@/utils/server'


// TODO: Revisit this logic
const mobileSize = {
    height: 672,
    width: 384,
} as const

const desktopSize = {
    height: 1344,
    width: 768,
} as const

interface SpotImageProps {
    className?: string
    image: string
    title: string
}

export function SpotImage({
    className,
    image,
    title,
}: SpotImageProps) {
    const size = isMobileClient()
        ? mobileSize
        : desktopSize

    return (
        <Image
            className={cn('inline rounded-xl shadow-md', className)}
            src={image}
            alt={`${title} image`}
            {...size}
        />
    )
}
