import { Spot } from '@your-spot/contracts'

import { Separator } from '@/components/ui/separator'


interface SpotInfoProps {
    spot: Spot
}

export function SpotInfo({ spot }: SpotInfoProps) {
    return (
        <div className='flex flex-col gap-6'>
            <h2 className='self-center'>
                {spot.title}
            </h2>
            <Separator />
            <div className='mx-6'>
                {spot.description}
            </div>
        </div>
    )
}
