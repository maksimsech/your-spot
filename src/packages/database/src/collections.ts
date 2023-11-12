import {Account} from 'models/account'

import {
    db,
    authDb,
} from './client'
import {
    Spot,
    User,
} from './models'


export const spotCollection = db.collection<Spot>('spots')

export const userCollection = authDb.collection<User>('users')
export const accountCollection = authDb.collection<Account>('accounts')
