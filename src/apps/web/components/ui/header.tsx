import { GlobeIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import { cn } from '@/utils'

import { ThemeModeToggle } from './theme-toggle'


interface HeaderProps {
    className: string
}

export function Header({ className }: HeaderProps) {
    return (
        <header className={cn('flex w-full flex-none items-center justify-between p-2 shadow-inner border-b dark:border-b-slate-300 border-b-slate-700', className)}>
            <span className='flex items-center gap-1'>
                <GlobeIcon className='h-[1.2rem] w-[1.2rem]' />
                <Link href='/' className='font-bold'>
                    Your spot
                </Link>
            </span>
            <ThemeModeToggle />
        </header>
    )
}
