import type { ObjectId } from 'mongodb'


export type Provider = 'google' | 'osu'

export interface Account {
    provider: Provider
    providerAccountId: string
    userId: ObjectId
}
