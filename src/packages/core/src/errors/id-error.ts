type IdErrorReason = 'invalid'

export class IdError extends Error {
    readonly #id: string
    readonly #reason: IdErrorReason

    constructor(id: string, message: string, reason: IdErrorReason = 'invalid') {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)

        this.name = 'IdError'
        this.#id = id
        this.#reason = reason
    }

    get id() {
        return this.#id
    }

    get reason() {
        return this.#reason
    }
}
