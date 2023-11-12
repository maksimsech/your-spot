import { MongoDBAdapter } from '@auth/mongodb-adapter'

import { clientPromise } from '@your-spot/database'


export const adapter = MongoDBAdapter(clientPromise, {
    databaseName: 'auth',
    collections: {
        Accounts: 'accounts',
        Sessions: 'sessions',
        Users: 'users',
        VerificationTokens: 'verificationTokens',
    },
})
