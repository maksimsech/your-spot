// TODO: Add geo index config for spot collection
import { spotCollection } from './collections'

(async () => {
    await spotCollection.createIndex({
        coordinate: '2dsphere',
    })

    process.exit(0)
})()
