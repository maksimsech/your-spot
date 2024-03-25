import { Suspense } from 'react'

import { HeartIcon } from '@radix-ui/react-icons'

import { LikeButtonContainer } from './like-button-container'


interface LikeButtonProps {
    spotId: string
}

export function LikeButton(props: LikeButtonProps) {
    return (
        <Suspense fallback={<HeartIcon className='m-2 animate-pulse' />}>
            <LikeButtonContainer {...props} />
        </Suspense>
    )
}
