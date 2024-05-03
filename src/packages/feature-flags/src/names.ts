const spotFeatures = [
    'spot_add_image',
    'spot_add',
    'spot_search',
] as const

const userFeatures = [
    'user_sign_in',
] as const

const allFeatures = [
    ...spotFeatures,
    ...userFeatures,
] as const


export type SpotFeature = typeof spotFeatures[number]
export type UserFeature = typeof userFeatures[number]
export type AllFeatures = typeof allFeatures[number]

export function isFeatureValid(value: string): value is AllFeatures {
    return allFeatures.includes(value as AllFeatures)
}
