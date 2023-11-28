const zoomValues = new Map<number, number>()
zoomValues.set(0, 1000)
zoomValues.set(1, 1000)
zoomValues.set(2, 1000)
zoomValues.set(3, 1000)
zoomValues.set(4, 1000)
zoomValues.set(5, 1000)
zoomValues.set(6, 1000)
zoomValues.set(7, 1000)
zoomValues.set(8, 1000)
zoomValues.set(9, 1000)
zoomValues.set(10, 1000)


export const minZoom = 0
export const maxZoom = 10

const defaultZoom = 1000
export function getDistanceForGroupByZoom(zoom: number) {
    return zoomValues.get(zoom) ?? defaultZoom
}
