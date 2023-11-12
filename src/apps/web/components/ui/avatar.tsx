'use client'

import {
    type ElementRef,
    type ComponentPropsWithoutRef,
    forwardRef,
} from 'react'

import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/utils'


const Avatar = forwardRef<
    ElementRef<typeof AvatarPrimitive.Root>,
    ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
        ref={ref}
        className={cn(
            'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
            className,
        )}
        {...props}
    />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

interface AvatarImageProps extends Omit<ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>, 'src'> {
    src: string | null | undefined
}
const AvatarImage = forwardRef<
    ElementRef<typeof AvatarPrimitive.Image>,
    AvatarImageProps
>(({ className, src: propSrc, ...props }, ref) => {
    const src = propSrc || undefined
    return(
        <AvatarPrimitive.Image
            ref={ref}
            src={src}
            className={cn('aspect-square h-full w-full', className)}
            {...props}
        />
    )})

AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = forwardRef<
    ElementRef<typeof AvatarPrimitive.Fallback>,
    ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
        ref={ref}
        className={cn(
            'flex h-full w-full items-center justify-center rounded-full bg-muted',
            className,
        )}
        {...props}
    />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export {
    Avatar,
    AvatarImage,
    AvatarFallback,
}
