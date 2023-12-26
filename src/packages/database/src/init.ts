import { spotCollection } from './collections'


(async () => {
    await spotCollection.createIndex({
        coordinate: '2dsphere',
    })

    process.exit(0)
})()
