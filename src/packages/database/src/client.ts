import {
    MongoClient,
    ServerApiVersion,
} from 'mongodb'


const client = new MongoClient(process.env.DATABASE_URL!, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

const db = client.db(process.env.DATABASE_NAME!)

export {
    client,
    db,
}
