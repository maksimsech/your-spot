import type { LayoutProps } from '@/types/layout-props'


export default function Layout({ children }: LayoutProps) {
    return (
        <div className='bg-background slide-in-from-bottom-0 fixed bottom-0 z-10 flex min-h-[40vh] w-full flex-col rounded-t-xl border p-6 duration-300'>
            {children}
        </div>
    )
}
