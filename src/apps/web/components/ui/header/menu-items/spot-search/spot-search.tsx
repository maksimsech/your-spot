'use client'

import { useState } from 'react'

import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'

import { SpotAutocomplete } from './spot-autocomplete'


export function SpotSearch() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                variant='outline'
                size='icon'
                onClick={() => setIsOpen(true)}
            >
                <MagnifyingGlassIcon />
                <span className='sr-only'>Open search spots menu</span>
            </Button>
            <SpotAutocomplete
                isOpen={isOpen}
                onIsOpenChange={setIsOpen}
            />
        </>
    )
}
