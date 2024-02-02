import type { ObjectId } from 'mongodb'

import type { Coordinate } from '../types'


export interface Spot {
    title: string
    description: string
    image?: string
    coordinate: Coordinate
    authorId: ObjectId | null
}
