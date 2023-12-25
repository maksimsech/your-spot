type IdErrorReason = 'invalid'

export class IdError extends Error {
    // TODO: To JS private (#)
    private readonly _id: string
    private readonly _reason: IdErrorReason

    // TODO: Verify constructor
    constructor(id: string, message: string, reason: IdErrorReason = 'invalid') {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)

        this.name = 'IdError'
        this._id = id
        this._reason = reason

        Error.captureStackTrace?.(this, this.constructor)
    }

    get id() {
        return this._id
    }

    get reason() {
        return this._reason
    }
}
