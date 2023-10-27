import { Spot } from '@your-spot/contracts'

import './spot-info.scss'


interface SpotInfoProps {
    spot: Spot
}

export function SpotInfo({ spot }: SpotInfoProps) {
    return (
        <div>
            <section>
                {spot.title}
            </section>
            <section>
                {spot.description}
            </section>
        </div>
    )
}
