import { redirect } from 'next/navigation'

import { getUser } from '@your-spot/core'

import { auth } from '@/auth'
import { UserProfile } from '@/components/users/profile/profile'


export default async function Page() {
    const session = await auth()
    // Middleware should handle all validation stuff
    const sessionUser = session!.user!

    const user = await getUser(sessionUser.id)
    if (!user) {
        // Smth went really wrong.
        // TODO: Add logging
        redirect('/')
    }

    return (
        <UserProfile user={user} />
    )
}
