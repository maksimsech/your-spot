import { Fragment } from 'react'

import Link from 'next/link'

import { getSpotsForAuthor } from '@your-spot/core'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'


interface SpotsProps {
    authorId: string
}

export async function Spots({ authorId }: SpotsProps) {
    const spots = await getSpotsForAuthor({ authorId })

    if (spots.length === 0) {
        return <span className='text-muted-foreground'>No spots yet.</span>
    }

    return (
        <ScrollArea className='h-56 w-full'>
            <div className='grid grid-cols-[minmax(96px,_35%)_1px_auto] gap-x-2 gap-y-3'>
                {spots.map(s => (
                    <Fragment key={s.id}>
                        <Link
                            className='break-words'
                            href={`/spots/${s.id}?action=navigate&lat=${s.coordinate.lat}&lng=${s.coordinate.lng}`}
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
