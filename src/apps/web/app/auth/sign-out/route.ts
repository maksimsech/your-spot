import { signOut } from '@/auth'
import { getAuthenticatedUser } from '@/auth/helper'


export const dynamic = 'force-dynamic'

export async function GET() {
    const user = await getAuthenticatedUser()
    if (user) {
        await signOut()
    }

    return Response.redirect('/', 307)
}
