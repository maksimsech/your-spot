import { User } from 'next-auth'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserAvatar } from '@/components/users/user-avatar'

import { DropdownItems } from './dropdown-items'


interface ProfileProps {
    user: User
}

export function Profile({ user }: ProfileProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <UserAvatar
                    className='h-8 w-8'
                    image={user.image}
                    name={user.name}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownItems />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
