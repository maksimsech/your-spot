/* eslint-disable tailwindcss/no-custom-classname */
'use client'

import {
    forwardRef,
    type HTMLAttributes,
    type ElementRef,
    type ComponentPropsWithoutRef,
} from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'

import { cn } from '@/utils'


const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = forwardRef<
    ElementRef<typeof DialogPrimitive.Overlay>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...restProps }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            className,
        )}
        {...restProps}
    />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

interface DialogContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
    hideClose?: boolean
}

const DialogContent = forwardRef<
    ElementRef<typeof DialogPrimitive.Content>,
    DialogContentProps
>(({
    className,
    children,
    hideClose,
    ...restProps
}, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
                className,
            )}
            {...restProps}
        >
            {children}
            {!hideClose && (
                <DialogPrimitive.Close className='ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none'>
                    <Cross2Icon className='size-4' />
                    <span className='sr-only'>Close</span>
                </DialogPrimitive.Close>
            )}
        </DialogPrimitive.Content>
    </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

function DialogHeader({
    className,
    ...restProps
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'flex flex-col space-y-1.5 text-center sm:text-left',
                className,
            )}
            {...restProps}
        />
    )
}
DialogHeader.displayName = 'DialogHeader'

function DialogFooter({
    className,
    ...restProps
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
                className,
            )}
            {...restProps}
        />
    )
}
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = forwardRef<
    ElementRef<typeof DialogPrimitive.Title>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...restProps }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(
            'text-lg font-semibold leading-none tracking-tight',
            className,
        )}
        {...restProps}
    />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = forwardRef<
    ElementRef<typeof DialogPrimitive.Description>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...restProps }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...restProps}
    />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
