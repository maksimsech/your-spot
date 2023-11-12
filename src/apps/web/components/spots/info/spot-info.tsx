import Link from 'next/link'

import {
    Spot,
    User,
} from '@your-spot/contracts'

import { getAuthorizedUser } from '@/auth/helper'
import {
    canDeleteSpot,
    canEditSpot,
} from '@/auth/rules/spots'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/users/user-avatar'
import { cn } from '@/utils'

import { DeleteDialog } from './delete-dialog'


interface SpotInfoProps {
    spot: Spot
    spotAuthor?: User | null
}

export async function SpotInfo({ spot, spotAuthor }: SpotInfoProps) {
    const user = await getAuthorizedUser()

    const showEdit = user && canEditSpot(spot, user)
    const showDelete = user && canDeleteSpot(spot, user)

    return (
        <div className='flex flex-col gap-6'>
            {spotAuthor && (
                <div className='flex justify-between'>
                    <div className='flex gap-2'>
                        {showEdit && (
                            <Link
                                className={cn(buttonVariants({ variant: 'outline' }))}
                                href={`/spots/${spot.id}/edit`}
                            >
                                Edit
                            </Link>
                        )}
                        {showDelete && (
                            <DeleteDialog
                                id={spot.id}
                                title={spot.title}
                            />
                        )}
                    </div>
                    <Link
                        className='text-muted-foreground flex items-center gap-1'
                        href={`/profile/${spotAuthor.id}`}
                    >
                        <span>
                            By
                        </span>
                        <UserAvatar
                            className='h-6 w-6'
                            name={spotAuthor.name}
                            image={spotAuthor.image}
                        />
                    </Link>
                </div>
            )}
            <h2 className='self-center'>
                {spot.title}
            </h2>
            <Separator />
            <div className='mx-6'>
                {spot.description}
            </div>
        </div>
    )
}
