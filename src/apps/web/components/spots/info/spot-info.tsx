import { Spot } from '../../../../../packages/contracts/src'

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
