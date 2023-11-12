import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from '@/components/ui/avatar'


interface UserAvatarProps {
    className?: string
    name?: string | null
    image?: string | null
}

export function UserAvatar({
    className,
    image,
    name,
}: UserAvatarProps) {
    const avatarFallback = !name
        ? 'P'
        : name.split(' ').map(n => n[0].toUpperCase()).join('')

    return (
        <Avatar className={className}>
            <AvatarImage
                src={image}
                alt='Profile avatar'
            />
            <AvatarFallback>
                {avatarFallback}
            </AvatarFallback>
        </Avatar>
    )
}
