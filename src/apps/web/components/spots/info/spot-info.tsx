import Link from 'next/link'

import type {
    Spot,
    User,
} from '@your-spot/contracts'

import { getAuthorizedUser } from '@/auth/helper'
import { canEditSpot } from '@/auth/rules/spots'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/users/user-avatar'
import { SpotImage } from '../image'

import { LikeButton } from './like-button'


interface SpotInfoProps {
    spot: Spot
    spotAuthor: User | null
}

export async function SpotInfo({ spot, spotAuthor }: SpotInfoProps) {
    // TODO: Revisit this with proper authorization
    const user = await getAuthorizedUser()

    const showEdit = user && canEditSpot(spot, user)

    return (
        <div className='flex flex-col gap-6'>
            {spotAuthor && (
                <div className='flex items-center justify-between'>
                    <div className='flex gap-2'>
                        {showEdit && (
                            <Link
                                className={buttonVariants({ variant: 'outline' })}
                                href={`/spots/${spot.id}/edit`}
                            >
                                Edit
                            </Link>
                        )}
                    </div>
                    <div className='flex items-center gap-2'>
                        <LikeButton spotId={spot.id} />
                        <Link
                            className='text-muted-foreground flex items-center gap-1'
                            href={`/profile/${spotAuthor.id}`}
                        >
                            <span>
                                By
                            </span>
                            <UserAvatar
                                className='size-6'
                                name={spotAuthor.name}
                                image={spotAuthor.image}
                            />
                        </Link>
                    </div>
                </div>
            )}
            <h2 className='self-center'>
                {spot.title}
            </h2>
            {spot.image && (
                <SpotImage
                    title={spot.title}
                    image={spot.image}
                />
            )}
            <Separator />
            <div className='text-muted-foreground mx-6'>
                {spot.description}
            </div>
        </div>
    )
}
