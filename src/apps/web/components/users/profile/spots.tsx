import { Fragment } from 'react'

import Link from 'next/link'

import { getSpotsForAuthor } from '@your-spot/core'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'


interface SpotsProps {
    id: string
}

export async function Spots({ id }: SpotsProps) {
    const spots = await getSpotsForAuthor(id)

    if (spots.length === 0) {
        return <span className='text-muted-foreground'>Not spots yet.</span>
    }

    return (
        <ScrollArea className='h-56 w-full'>
            <div className='grid grid-cols-[minmax(96px,_35%)_1px_auto] gap-x-2 gap-y-3'>
                {spots.map(s => (
                    <Fragment key={s.id}>
                        <Link
                            className='break-words'
                            href={`/spots/${s.id}`}
                        >
                            {s.title}
                        </Link>
                        <Separator orientation='vertical' />
                        <span className='text-muted-foreground'>
                            {s.description}
                        </span>
                    </Fragment>
                ))}
            </div>
        </ScrollArea>
    )
}
