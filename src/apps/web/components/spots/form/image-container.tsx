import { SpotImage } from '../image'

import {
    SpotForm,
    type SpotFormProps,
} from './spot-form'


interface ImageContainerProps extends Omit<SpotFormProps, 'image'> {
}

export function ImageContainer(props: ImageContainerProps) {
    const { spot } = props

    const imageTitle = spot?.image && spot?.title
        ? `${spot.title} image`
        : 'Spot image'

    const Image = spot?.image
        ? (
            <SpotImage
                title={imageTitle}
                image={spot.image}
            />
        )
        : null

    return (
        <SpotForm
            {...props}
            image={Image}
        />
    )
}
