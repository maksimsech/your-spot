import { SpotImage } from '../image'

import {
    SpotForm,
    type SpotFormProps as SpotFormPropsInternal,
} from './spot-form'


interface SpotFormProps extends Omit<SpotFormPropsInternal, 'image'> {
}

export function ImageContainer(props: SpotFormProps) {
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
