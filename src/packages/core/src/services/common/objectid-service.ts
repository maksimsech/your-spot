import { ObjectId } from '@your-spot/database'


export function toWithStringId<T extends { _id: ObjectId }>(object: T): Omit<T, '_id'> & { id: string} {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...newObject } = {
        ...object,
        id: objectIdToString(object._id),
    }

    return newObject
}

export function toWithObjectId<T extends { id: string }>(object: T): Omit<T, 'id'> & { _id: ObjectId} {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...newObject } = {
        ...object,
        _id: stringToObjectId(object.id),
    }

    return newObject
}

export function objectIdToString(id: ObjectId) {
    return id.toHexString()
}

export function stringToObjectId(id: string) {
    return ObjectId.createFromHexString(id)
}

export function isValid(id: string) {
    return ObjectId.isValid(id)
}

export function isNotValid(id: string) {
    return !isValid(id)
}
