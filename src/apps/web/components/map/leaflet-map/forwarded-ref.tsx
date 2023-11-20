import type { Ref } from 'react'

import { Map } from '@your-spot/map'
import type {
    MapProps,
    MapRef,
} from '@your-spot/map-types'


export interface ForwardedRefMapProps extends MapProps {
    forwardedRef: Ref<MapRef>
}

export function ForwardedRefMap({ forwardedRef, ...restProps }: ForwardedRefMapProps) {
    return (
        <Map
            ref={forwardedRef}
            {...restProps}
        />
    )
}
