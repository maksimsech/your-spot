import { Header } from '@/components/ui/header/header'
import type { LayoutProps } from '@/types/layout-props'


export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Header className='flex-none' />
            {children}
        </>
    )
}
