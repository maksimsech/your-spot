import { redirect } from 'next/navigation'

import { getUser } from '@your-spot/core'

import { getAuthorizedUser } from '@/auth/helper'
import { UserProfile } from '@/components/users/profile/profile'


export default async function Page() {
    const sessionUser = await getAuthorizedUser()
    // Middleware should handle all validation stuff
    const user = await getUser(sessionUser!.id)
    if (!user) {
        // Smth went really wrong.
        // TODO: Add logging
        redirect('/')
    }

    return (
        <UserProfile user={user} />
    )
}
