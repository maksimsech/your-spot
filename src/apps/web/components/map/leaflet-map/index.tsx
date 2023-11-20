import dynamic from 'next/dynamic'

import type { ForwardedRefMapProps } from './forwarded-ref'
import { MapLoader } from './map-loader'


const Map = dynamic<ForwardedRefMapProps>(
    () => import('./forwarded-ref').then(m => m.ForwardedRefMap),
    {
        loading: () => <MapLoader />,
        ssr: false,
    },
)

export {
    Map,
    MapLoader,
}
