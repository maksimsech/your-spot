import type { Session } from 'next-auth'

import type { AuthUser } from '@your-spot/auth'
import { getSpotAuthorId } from '@your-spot/core'

import { canEditSpot } from '../rules/spots'


// TODO: Refactor with some library or create custom
export async function validateAuthorizedRoute(session: Session | null, request: Request) {
    const isAuthenticated = !!session?.user

    if (!isAuthenticated) {
        return true
    }

    const spotsEditPageResult = await validateSpotsEditPage(session.user!, request)
    if (!spotsEditPageResult) {
        return false
    }

    return true
}

const spotsEditPageRegex = /spots\/(.*)\/edit$/gm
async function validateSpotsEditPage(user: AuthUser, request: Request) {
    const regexResults = spotsEditPageRegex.exec(request.url)
    if (!regexResults || regexResults.length < 2) {
        return true
    }

    const spotId = regexResults[1]

    const spot = await getSpotAuthorId(spotId)
    if (!spot) {
        return true
    }

    return canEditSpot(spot, user)
}
