import type { AuthUser } from '@your-spot/auth'
import type { Spot } from '@your-spot/contracts'

import { getAuthenticatedUser } from '../helper'


type SpotWithAuthor = Pick<Spot, 'authorId'>

export async function canAddSpot() {
    const user = await getAuthenticatedUser()

    return !!user
}

export function canEditSpot(spot: SpotWithAuthor, user: AuthUser) {
    return spot.authorId === user.id
}

export function canDeleteSpot(spot: SpotWithAuthor, user: AuthUser) {
    return spot.authorId === user.id
}
