import { getLikeInformation } from '@your-spot/core'

import { getAuthorizedUser } from '@/auth/helper'

import { LikeButton } from './like-button'


interface LikeButtonContainerProps {
    spotId: string
}

async function LikeButtonContainer({ spotId }: LikeButtonContainerProps) {
    const user = await getAuthorizedUser()
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
        />
    )
}

export { LikeButtonContainer as LikeButton }
