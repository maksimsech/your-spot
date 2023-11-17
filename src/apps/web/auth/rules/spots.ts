import type { AuthUser } from '@your-spot/auth'
import type { Spot } from '@your-spot/contracts'


export function canEditSpot(spot: Spot, user: AuthUser) {
    return spot.authorId === user.id
}

export function canDeleteSpot(spot: Spot, user: AuthUser) {
    return spot.authorId === user.id
}
