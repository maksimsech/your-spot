import type { ObjectId } from 'mongodb'


export interface SpotLikes {
    spotId: ObjectId
    userIds: ObjectId[]
}
