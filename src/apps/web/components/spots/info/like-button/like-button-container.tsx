import {
    HeartFilledIcon,
    HeartIcon,
} from '@radix-ui/react-icons'

import { getLikeInformation } from '@your-spot/core'

import { getAuthenticatedUser } from '@/auth/helper'

import { LikeButton } from './like-button'


interface LikeButtonContainerProps {
    spotId: string
}

async function LikeButtonContainer({ spotId }: LikeButtonContainerProps) {
    const user = await getAuthenticatedUser()
    const userId = user?.id || null

    const likeInformation = await getLikeInformation({
        spotId,
        userId,
    })

    return (
        <LikeButton
            likeInformation={likeInformation}
            userId={userId}
            spotId={spotId}
            likedIcon={<HeartFilledIcon className='text-red-700' />}
            blankIcon={<HeartIcon />}
        />
    )
}

export { LikeButtonContainer }
