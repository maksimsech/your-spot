import { ObjectId } from 'mongodb'

import { Coordinate } from '../types'


export interface Spot {
    title: string
    description: string
    image?: string
    coordinate: Coordinate
    authorId: ObjectId | null
}
