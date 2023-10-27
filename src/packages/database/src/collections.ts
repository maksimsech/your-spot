import { db } from './client'
import { Spot } from './models'


export const spotCollection = db.collection<Spot>('spots')
