import { Map } from '@/components/map'
import { Header } from '@/components/ui/header'
import { LayoutProps } from '@/types/layout-props'


export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Header className='flex-none' />
            <div className='flex-auto'>
                <Map />
            </div>
            {children}
        </>
    )
}
