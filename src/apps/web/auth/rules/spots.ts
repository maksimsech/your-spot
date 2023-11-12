import {
    Spot,
    User,
} from '@your-spot/contracts'


export function canEditSpot(spot: Spot, user: User) {
    return spot.authorId === user.id
}

export function canDeleteSpot(spot: Spot, user: User) {
    return spot.authorId === user.id
}
