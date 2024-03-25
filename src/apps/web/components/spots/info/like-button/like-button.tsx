'use client'

import { useState } from 'react'

import {
    HeartFilledIcon,
    HeartIcon,
} from '@radix-ui/react-icons'

import type { SpotLikeInformation } from '@your-spot/contracts'

import {
    dislikeSpot,
    likeSpot,
} from '@/actions/spots'
import { Button } from '@/components/ui/button'


interface LikeButtonProps {
    likeInformation: SpotLikeInformation
    spotId: string
    userId: string | null
}

export function LikeButton({
    likeInformation,
    spotId,
    userId,
}: LikeButtonProps) {
    const [loading, setLoading] = useState(false)
    const [likedByUser, setLikedByUser] = useState(likeInformation.likedByUser)
    const [likesCount, setLikesCount] = useState(likeInformation.likesCount)

    const handleButtonClick = async () => {
        setLoading(true)
        try {
            const resultPromise = likedByUser
                ? dislikeSpot({ userId: userId!, spotId })
                : likeSpot({ userId: userId!, spotId })

            const result = await resultPromise

            setLikedByUser(result.likedByUser)
            setLikesCount(result.likesCount)
        }
        finally {
            setLoading(false)
        }
    }

    const Icon = likedByUser
        ? HeartFilledIcon
        : HeartIcon

    const disabled = !userId || loading

    return (
        <Button
            className='flex gap-1'
            variant='ghost'
            onClick={handleButtonClick}
            disabled={disabled}
        >
            <span>
                {likesCount}
            </span>
            <Icon />
        </Button>
    )
}
