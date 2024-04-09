import type { ObjectId } from 'bson'
import {
    App,
    Credentials,
} from 'realm-web'

import type { Spot as SpotContract } from '@your-spot/contracts'


interface Spot extends SpotContract {
    _id: ObjectId
}

interface SpotImage extends Pick<Spot, '_id'> {
    image: NonNullable<Spot['image']>
}

export interface Env {
    KV_NAMESPACE: KVNamespace
    IMAGE_BUCKET: R2Bucket

    ATLAS_APP_ID: string
    ATLAS_API_KEY: string
}

const latestRunKey = '@your-spot/image-cleanup-worker:latest_run'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
        console.log(`trigger fired at ${event.cron}`)

        const client = await createMongoClient(env)
        const spotsCollection = client.db('core').collection<Spot>('spots')
        const imageBucket = env.IMAGE_BUCKET
        const kvNamespace = env.KV_NAMESPACE

        const latestRun = await getLatestRun(kvNamespace)

        const {
            spots,
            images,
        } = await getSpotsAndImages(spotsCollection, imageBucket, latestRun)
        console.log('total spots', spots.length)
        console.log('total images', spots.length)

        const spotsToRemoveImage = getImagesNotInR2(spots, images)
        console.log('spots to remove image', spotsToRemoveImage.length)
        const imagesToDelete = getImageNotInDb(spots, images)
        console.log('images to delete', imagesToDelete.length)

        if (spotsToRemoveImage.length) {
            // TODO: Technically image could be already updated to smth else while we calculating what to update.
            // But this is really rare case.
            // Consider to update this code.
            await spotsCollection.updateMany(
                {
                    _id: {
                        $in: spots.map(s => s._id),
                    },
                },
                {
                    $set: {
                        image: null,
                    },
                },
            )
            console.log('Spots updated')
        }

        if (imagesToDelete.length) {
            console.log('Images deleted')
            await imageBucket.delete(imagesToDelete.map(i => i.key))
        }

        await kvNamespace.put(latestRunKey, Date.now().toString())
    },
}


async function createMongoClient(env: Env) {
    const app = new App(env.ATLAS_APP_ID)
    const credentials = Credentials.apiKey(env.ATLAS_API_KEY)
    const user = await app.logIn(credentials)

    return user.mongoClient('mongodb-atlas')
}

async function getLatestRun(kvNamespace: KVNamespace<string>) {
    const latestRunString = await kvNamespace.get(latestRunKey)
    if (!latestRunString) {
        return null
    }
    return new Date(parseInt(latestRunString, 10))
}

async function getSpotsAndImages(
    spotsCollection: Realm.Services.MongoDB.MongoDBCollection<Spot>,
    imageBucket: R2Bucket,
    latestRun: Date | null,
) {
    if (latestRun) {
        const [spots, images] = await Promise.all([
            getSpotsImagesOlderThan(spotsCollection, latestRun),
            getFilesOlderThanDate(imageBucket, latestRun),
        ])

        return {
            spots,
            images,
        }
    }

    const [spots, imageList] = await Promise.all([
        getSpotsWithImage(spotsCollection),
        imageBucket.list(),
    ])
    const images = imageList.objects

    return {
        spots,
        images,
    }
}

function getSpotsImagesOlderThan(spotsCollection: Realm.Services.MongoDB.MongoDBCollection<Spot>, date: Date): Promise<ReadonlyArray<SpotImage>> {
    return spotsCollection
        .aggregate([
            {
                $match: {
                    $and: [
                        {
                            image: {
                                $exists: true,
                                $ne: null,
                            },
                        },
                        {
                            $or: [
                                { createAt: { $gte: date } },
                                { updatedAt: { $gte: date } },
                            ],
                        },
                    ],
                },
            },
            {
                $project: {
                    image: 1,
                },
            },
        ])
}

function getSpotsWithImage(spotsCollection: Realm.Services.MongoDB.MongoDBCollection<Spot>): Promise<ReadonlyArray<SpotImage>> {
    return spotsCollection
        .aggregate([
            {
                $match: {
                    $and: [
                        {
                            image: {
                                $exists: true,
                                $ne: null,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    image: 1,
                },
            },
        ])
}

async function getFilesOlderThanDate(imageBucket: R2Bucket, date: Date) {
    const prefixes = getStoragePrefixesBetweenDateAndToday(date)

    const listPromises = prefixes
        .map(p => imageBucket.list({
            prefix: p,
        }))

    const lists = await Promise.all(listPromises)
    return lists.flatMap(l => l.objects)
}

function getStoragePrefixesBetweenDateAndToday(date: Date) {
    const dates = []
    const currentDate = new Date(date)
    const endDate = new Date(Date.now())
    endDate.setHours(23)
    endDate.setMinutes(59)
    endDate.setSeconds(59)
    endDate.setMilliseconds(999)

    while (currentDate <= endDate) {
        dates.push(formatDate(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
}

function formatDate(date: Date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0') // Adding 1 because January is 0
    const day = (date.getDate()).toString().padStart(2, '0')
    return `${year}-${month}-${day}`
}

// TODO: Optimize (?)
function getImagesNotInR2(spots: ReadonlyArray<SpotImage>, images: ReadonlyArray<R2Object>) {
    return spots
        .filter(s => images.every(i => !s.image.includes(i.key)))
}

function getImageNotInDb(spots: ReadonlyArray<SpotImage>, images: ReadonlyArray<R2Object>) {
    return images
        .filter(i => spots.every(s => !s.image.includes(i.key)))
}
