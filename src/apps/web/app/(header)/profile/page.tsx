import { redirect } from 'next/navigation'

import { getUser } from '@your-spot/core'

import { getAuthorizedUser } from '@/auth/helper'
import { UserProfile } from '@/components/users/profile/profile'
import { serverLog } from '@/server-log'


export default async function Page() {
    const sessionUser = await getAuthorizedUser()
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

        // TODO: Sign off?
        redirect('/')
    }

    return (
        <UserProfile user={user} />
    )
}
