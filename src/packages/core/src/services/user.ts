import type {
    User,
    Account,
} from '@your-spot/contracts'
import {
    accountCollection,
    userCollection,
    type User as DbUser,
    type Account as DbAccount,
    type WithId,
} from '@your-spot/database'

import {
    isNotValid,
    objectIdToString,
    stringToObjectId,
    toWithStringId,
} from './common'


export async function getUser(id: string) {
    if (isNotValid(id)) {
        console.warn('user/getUser Wrong id were passed.', id)
        return null
    }

    const objectId = stringToObjectId(id)

    const dbUser = await userCollection.findOne({
        _id: objectId,
    })
    if (!dbUser) {
        return null
    }

    return createUserFromDbUser(dbUser)
}

export async function getUserAccounts(id: string) {
    if (isNotValid(id)) {
        console.warn('user/getUserAccounts Wrong id were passed.', id)
        return []
    }

    const objectId = stringToObjectId(id)

    const dbAccounts = await accountCollection
        .find({
            userId: objectId,
        })
        .toArray()

    return dbAccounts.map(createAccountFromDbAccount)
}

function createUserFromDbUser(user: WithId<DbUser>): User {
    return toWithStringId(user)
}

function createAccountFromDbAccount(account: WithId<DbAccount>): Account {
    return {
        ...toWithStringId(account),
        userId: objectIdToString(account.userId),
    }
}
