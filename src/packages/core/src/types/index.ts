// TODO: Naming (?) and to common (?)
export type ToWithReadonlyArray<T> = {
    readonly [P in keyof T]: T[P] extends Array<infer R>
        ? readonly R[]
        : T[P]
}
