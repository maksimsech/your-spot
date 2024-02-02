import Link from 'next/link'

import type { Spot } from '@your-spot/contracts'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/utils'


interface SpotGroupProps {
    className: string
    spots: ReadonlyArray<Spot>
}

export function SpotGroup({ spots, className }: SpotGroupProps) {
    return (
        <ScrollArea className={cn(className, 'w-full')}>
            <div className='flex flex-col gap-3'>
                {spots.map(s => (
                    <Link
                        key={s.id}
                        className='flex min-h-[60px] w-full gap-1 rounded border border-slate-500 p-3'
                        href={`/spots/${s.id}`}
                    >
                        {!!s.description ? (
                            <>
                                <div className='w-2/5'>
                                    {s.title}
                                </div>
                                <div className='foreground-text-color text-sm'>
                                    {s.description}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='w-full self-center text-center'>
                                    {s.title}
                                </div>
                            </>
                        )}
                    </Link>
                ))}
            </div>
        </ScrollArea>
    )
}
