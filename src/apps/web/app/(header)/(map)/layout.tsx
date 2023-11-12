import { Map } from '@/components/map'
import { LayoutProps } from '@/types/layout-props'


export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <div className='flex-auto'>
                <Map />
            </div>
            {children}
        </>
    )
}
