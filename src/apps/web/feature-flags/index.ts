import { unstable_cache as cache } from 'next/cache'

import {
    type AllFeatures,
    isFeatureEnabled as isFeatureEnabledLib,
} from '@your-spot/feature-flags'


export function isFeatureEnabled(...args: Parameters<typeof isFeatureEnabledLib>) {
    const cacheTag = getCacheTag(args[0])
    const cachedIsFeatureEnabledLib = cache(
        isFeatureEnabledLib,
        ['feature-flags', cacheTag],
        { tags: [globalCacheTag, cacheTag], revalidate },
    )

    return cachedIsFeatureEnabledLib(...args)
}

export function getCacheTag(feature: AllFeatures) {
    return `feature-flag-${feature}`
}

export const globalCacheTag = 'feature-flag'

const revalidate = 24 * 60 // 24 hours

