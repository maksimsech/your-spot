import { getValue } from './cloudflare-kv'


export type SpotFeature =
    | 'spot_add_image'
    | 'spot_add'
    | 'spot_search'

export type UserFeature =
    | 'user_sign_in'

export type AllFeatures =
    | SpotFeature
    | UserFeature


export async function isFeatureEnabled(feature: AllFeatures) {
    try {
        const key = getKey(feature)
        const kvResponse = await getValue(key)

        const number = parseInt(kvResponse, 10)
        if (Number.isNaN(number)) {
            console.log(`feature-flags/Non number value stored for feature ${feature}`, kvResponse)
            return false
        }

        return number !== 0
    } catch (e) {
        console.log(`feature-flags/Error encountered for feature ${feature}`, e)
        return false
    }
}


function getKey(feature: AllFeatures) {
    return `@your-spot/features:${feature}`
}
