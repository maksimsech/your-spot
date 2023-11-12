import { Header } from '@/components/ui/header/header'
import { LayoutProps } from '@/types/layout-props'


export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Header className='flex-none' />
            {children}
        </>
    )
}
