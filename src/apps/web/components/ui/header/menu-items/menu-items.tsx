'use client'

import { useState } from 'react'

import {
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from '@radix-ui/react-icons'

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
            </CollapsibleContent>
        </Collapsible>
    )
}
