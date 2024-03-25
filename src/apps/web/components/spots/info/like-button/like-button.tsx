'use client'

import {
    type ReactNode,
    useState,
} from 'react'

import type { SpotLikeInformation } from '@your-spot/contracts'

import {
    removeSpotLike,
    likeSpot,
} from '@/actions/spots'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils'


interface LikeButtonProps {
    likeInformation: SpotLikeInformation
    spotId: string
    userId: string | null
    likedIcon: ReactNode
    blankIcon: ReactNode
}

export function LikeButton({
    likeInformation,
    spotId,
    userId,
    likedIcon,
    blankIcon,
}: LikeButtonProps) {
    const [loading, setLoading] = useState(false)
    const [likedByUser, setLikedByUser] = useState(likeInformation.likedByUser)
    const [likesCount, setLikesCount] = useState(likeInformation.likesCount)

    const handleButtonClick = async () => {
        setLoading(true)
        try {
            const resultPromise = likedByUser
                ? removeSpotLike({ userId: userId!, spotId })
                : likeSpot({ userId: userId!, spotId })

            const result = await resultPromise

            setLikedByUser(result.likedByUser)
            setLikesCount(result.likesCount)
        }
        finally {
            setLoading(false)
        }
    }

    const anonymous = !userId
    const icon = userId
        ? likedByUser
            ? likedIcon
            : blankIcon
        : likedIcon

    const disabled = anonymous || loading

    return (
        <Button
            className={cn('flex gap-1 p-2', {
                'disabled:opacity-100': anonymous,
            })}
            variant='ghost'
            onClick={handleButtonClick}
            disabled={disabled}
        >
            <span>
                {likesCount}
            </span>
            {icon}
        </Button>
    )
}
