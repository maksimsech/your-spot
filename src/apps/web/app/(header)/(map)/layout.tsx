import { Map } from '@/components/map'
import type { LayoutProps } from '@/types/layout-props'


export default function Layout({ children }: LayoutProps) {
    return (
        <Map className='flex-auto'>
            {children}
        </Map>
    )
}
