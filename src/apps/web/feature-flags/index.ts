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
        { tags: [cacheTag], revalidate },
    )

    return cachedIsFeatureEnabledLib(...args)
}


const revalidate = 24 * 60 // 24 hours

function getCacheTag(feature: AllFeatures) {
    return `feature-flag-${feature}`
}
