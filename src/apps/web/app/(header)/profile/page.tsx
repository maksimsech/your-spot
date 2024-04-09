import { redirect } from 'next/navigation'

import { getUser } from '@your-spot/core'

import { signOut } from '@/auth'
import { ensureAuthenticated } from '@/auth/helper'
import { UserProfile } from '@/components/users/profile/profile'
import { serverLog } from '@/utils/server'


export default async function Page() {
    const sessionUser = await ensureAuthenticated()
    // Middleware should handle all validation stuff
    const user = await getUser(sessionUser!.id)
    if (!user) {
        serverLog(
            'page/profile can\'t get user from db for authorized user',
            {
                logLevel: 'error',
                data: [sessionUser!.id],
            },
        )

        await signOut()
        redirect('/')
    }

    return (
        <UserProfile user={user} />
    )
}
