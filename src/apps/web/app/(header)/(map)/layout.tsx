import { canAddSpot as canAddSpotRule } from '@/auth/rules/spots'
import { Map } from '@/components/map'
import { isFeatureEnabled } from '@/feature-flags'
import type { LayoutProps } from '@/types/layout-props'


export default async function Layout({ children }: LayoutProps) {
    const canAddSpot = await isFeatureEnabled('spot_add') && await canAddSpotRule()

    return (
        <Map
            className='flex-auto'
            canAddSpot={canAddSpot}
        >
            {children}
        </Map>
    )
}
