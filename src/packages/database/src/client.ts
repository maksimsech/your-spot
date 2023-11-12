import {
    MongoClient,
    ServerApiVersion,
} from 'mongodb'


declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient>
    // eslint-disable-next-line no-var
    var _mongoClient: MongoClient
}

function createClient() {
    return new MongoClient(process.env.DATABASE_URL!, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    })
}

let client: MongoClient
let clientPromise: Promise<MongoClient>
if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        global._mongoClient = client = createClient()
        global._mongoClientPromise = client.connect()
    }
    client = global._mongoClient
    clientPromise = global._mongoClientPromise
} else {
    // In production mode, it's best to not use a global variable.
    client = createClient()
    clientPromise = client.connect()
}

const db = client.db(process.env.DATABASE_NAME!)
const authDb = client.db(process.env.AUTH_DATABASE_NAME!)

export {
    client,
    clientPromise,
    db,
    authDb,
}
