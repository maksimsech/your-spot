'use client'

import { useState } from 'react'

import {
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
    GitHubLogoIcon,
} from '@radix-ui/react-icons'
import Link from 'next/link'

import { cn } from '@/utils'
import { buttonVariants } from '../../button'
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from '../../collapsible'
import { ThemeModeToggle } from '../../theme-toggle'

import { SpotSearch } from './spot-search'


export function MenuItems() {
    const [isOpen, setIsOpen] = useState(false)


    return (
        <Collapsible
            className='flex flex-row gap-2'
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <CollapsibleTrigger>
                {isOpen ? (
                    <DoubleArrowLeftIcon />
                ) : (
                    <DoubleArrowRightIcon />
                )}
            </CollapsibleTrigger>
            <CollapsibleContent className='data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right flex gap-2'>
                <SpotSearch />
                <ThemeModeToggle />
                <Link
                    className={cn(buttonVariants({ variant: 'outline'}), 'p-2')}
                    href='https://github.com/maksimsech/your-spot'
                    target='_blank'
                >
                    <GitHubLogoIcon />
                </Link>
            </CollapsibleContent>
        </Collapsible>
    )
}
