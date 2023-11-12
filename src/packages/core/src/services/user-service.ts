import {
    User,
    Account,
} from '@your-spot/contracts'
import {
    User as DbUser,
    Account as DbAccount,
    WithId,
    accountCollection,
    userCollection,
} from '@your-spot/database'

import {
    objectIdToString,
    stringToObjectId,
    toWithStringId,
} from './objectid-service'


export async function getUser(id: string) {
    let objectId = null

    try {
        objectId = stringToObjectId(id)
    }
    catch
    {
        return null
    }

    const dbUser = await userCollection.findOne({
        _id: objectId,
    })
    if (!dbUser) {
        return null
    }

    return createUserFromDbUser(dbUser)
}

export async function getUserAccounts(id: string) {
    let objectId = null

    try {
        objectId = stringToObjectId(id)
    }
    catch
    {
        return []
    }

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
