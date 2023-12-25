import type { AuthUser } from '@your-spot/auth'
import type { Spot } from '@your-spot/contracts'


type SpotWithAuthor = Pick<Spot, 'authorId'>

export function canEditSpot(spot: SpotWithAuthor, user: AuthUser) {
    return spot.authorId === user.id
}

export function canDeleteSpot(spot: SpotWithAuthor, user: AuthUser) {
    return spot.authorId === user.id
}
