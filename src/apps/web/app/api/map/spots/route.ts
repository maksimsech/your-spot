import type { Bounds } from '@your-spot/contracts'
import { getSpotsAndGroupsWithinBounds } from '@your-spot/core/services'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    // TODO: Validate with zod
    const requestBody: {
        bounds: Bounds
        zoom: number
    } = await request.json()

    const result = await getSpotsAndGroupsWithinBounds(requestBody.bounds, requestBody.zoom)

    return Response.json(result)
}
