export const minZoom = 0
export const maxZoom = 10

// TODO: Check how to create function from this.
export function getDistanceForGroupByZoom(zoom: number) {
    if (zoom > 9) {
        return 0
    }
    if (zoom > 8) {
        return .1
    }
    if (zoom > 7) {
        return .15
    }
    if (zoom > 6.5) {
        return .4
    }
    if (zoom > 6) {
        return .5
    }
    if (zoom > 5.5) {
        return 1.3
    }
    if (zoom > 4.5) {
        return 3
    }
    if (zoom > 3) {
        return 6
    }

    return Number.MIN_SAFE_INTEGER
}
