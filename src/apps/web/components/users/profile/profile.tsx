import type { User } from '@your-spot/contracts'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { UserAvatar } from '../user-avatar'

import { LinkedAccounts } from './linked-accounts'
import { Spots } from './spots'


interface UserProfileProps {
    user: User
}

export function UserProfile({ user }: UserProfileProps) {
    return (
        <div className='mt-3 flex flex-col gap-6'>
            <div className='flex flex-col items-center gap-4'>
                <h1 className='font-bold'>{user.name}</h1>
                {user.image && (
                    <UserAvatar
                        className='size-12'
                        name={user.name}
                        image={user.image}
                    />
                )}
            </div>
            <Accordion
                className='w-5/6 place-self-center'
                type='single'
                collapsible
            >
                <AccordionItem value='linked-accounts'>
                    <AccordionTrigger>Linked Accounts</AccordionTrigger>
                    <AccordionContent>
                        <LinkedAccounts id={user.id} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value='spots'>
                    <AccordionTrigger>Spots</AccordionTrigger>
                    <AccordionContent>
                        <Spots id={user.id} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
