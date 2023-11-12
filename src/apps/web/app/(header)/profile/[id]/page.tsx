import { notFound } from 'next/navigation'

import { getUser } from '@your-spot/core'

import { UserProfile } from '@/components/users/profile/profile'


interface PageProps {
    params: {
        id: string
    }
}

export default async function Page({
    params: {
        id,
    },
}: PageProps) {
    const user = await getUser(id)
    if (!user) {
        notFound()
    }

    return (
        <UserProfile user={user} />
    )
}
