import { revalidateTag } from 'next/cache'

import { isFeatureValid } from '@your-spot/feature-flags'

import { refreshFFCacheApiKey } from '@/env'
import {
    globalCacheTag,
    getCacheTag,
} from '@/feature-flags'


export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    const apiKey = request.headers.get('API-Key')

    if (apiKey !== refreshFFCacheApiKey) {
        return new Response(null, { status: 403 })
    }

    const feature = new URL(request.url).searchParams.get('feature')

    if (!feature) {
        revalidateTag(globalCacheTag)
    } else {
        if (!isFeatureValid(feature)) {
            console.log('Wrong feature name were passed to system/refresh-ff-cache endpoint', feature)
            return new Response(null, { status: 400 })
        }

        revalidateTag(getCacheTag(feature))
    }

    return new Response(null, { status: 202 })
}
