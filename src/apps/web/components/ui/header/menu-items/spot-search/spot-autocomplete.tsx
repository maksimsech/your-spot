'use client'

import { useRouter } from 'next/navigation'

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandLoading,
    CommandItem,
} from '@/components/ui/command'
import { LoaderWithDelay } from '@/components/ui/loader-with-delay'

import { useSearchSpots } from './use-search-spots'


interface SpotAutocompleteArguments {
    isOpen: boolean
    onIsOpenChange: (isOpen: boolean) => void
}

export function SpotAutocomplete({
    isOpen,
    onIsOpenChange: onIsOpenChangeProp,
}: SpotAutocompleteArguments) {
    const router = useRouter()

    const {
        isLoading,
        spots,
        onTextUpdated,
        reset,
    } = useSearchSpots()

    const onIsOpenChange = (newIsOpen: boolean) => {
        if (!newIsOpen) {
            reset()
        }

        onIsOpenChangeProp(newIsOpen)
    }

    return (
        <CommandDialog
            className='top-0 translate-y-0'
            open={isOpen}
            onOpenChange={onIsOpenChange}
            shouldFilter={false}
            loop
        >
            <CommandInput onValueChange={onTextUpdated} />
            <CommandList>
                {isLoading && (
                    <CommandLoading className='flex justify-center'>
                        <LoaderWithDelay
                            className='m-2'
                            showWithDelay
                        />
                    </CommandLoading>
                )}
                <CommandGroup
                    heading='Spots on your map'
                >
                    {spots.map(s => (
                        <CommandItem
                            key={s.id}
                            value={s.id}
                            onSelect={() => {
                                console.log('aasd')
                                onIsOpenChange(false)
                                router.push(`/spots/${s.id}`)
                            }}
                        >
                            {s.coordinate.lat}
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandEmpty>
                    No spots found. :(
                </CommandEmpty>
            </CommandList>
        </CommandDialog>
    )
}
