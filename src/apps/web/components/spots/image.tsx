import { headers } from 'next/headers'
import Image from 'next/image'
import { userAgent } from 'next/server'


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
    image: string
    title: string
}

export function SpotImage({ image, title }: SpotImageProps) {
    const { device } = userAgent({
        headers: headers(),
    })

    const size = device.type === 'mobile'
        ? mobileSize
        : desktopSize

    return (
        <Image
            className=' self-center'
            src={image}
            alt={`${title} image`}
            {...size}
        />
    )
}
