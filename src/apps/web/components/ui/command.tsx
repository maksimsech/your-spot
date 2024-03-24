'use client'

import {
    type HTMLAttributes,
    type ComponentPropsWithoutRef,
    type ElementRef,
    forwardRef,
} from 'react'

import type { DialogProps } from '@radix-ui/react-dialog'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Command as CommandPrimitive } from 'cmdk'

import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog'
import { cn } from '@/utils'


const Command = forwardRef<
    ElementRef<typeof CommandPrimitive>,
    ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...restProps }, ref) => (
    <CommandPrimitive
        ref={ref}
        className={cn(
            'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
            className,
        )}
        {...restProps}
    />
))
Command.displayName = CommandPrimitive.displayName

const CommandLoading = forwardRef<
    ElementRef<typeof CommandPrimitive.Loading>,
    ComponentPropsWithoutRef<typeof CommandPrimitive.Loading>
>((props, ref) => (
    <CommandPrimitive.Loading
        ref={ref}
        {...props}
    />
))
CommandLoading.displayName = CommandPrimitive.Loading.displayName

interface CommandDialogProps extends DialogProps {
    className?: string
    shouldFilter?: boolean
    loop?: boolean
}

const CommandDialog = ({
    className,
    children,
    shouldFilter = true,
    loop = false,
    ...restProps
}: CommandDialogProps) => {
    return (
        <Dialog {...restProps}>
            <DialogContent className={cn('overflow-hidden p-0', className)}>
                <Command
                    className='[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5'
                    shouldFilter={shouldFilter}
                    loop={loop}
                >
                    {children}
                </Command>
            </DialogContent>
        </Dialog>
    )
}

const CommandInput = forwardRef<
  ElementRef<typeof CommandPrimitive.Input>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, children, ...restProps }, ref) => (
    <div className='flex items-center border-b px-3' cmdk-input-wrapper=''>
        <MagnifyingGlassIcon className='mr-2 size-4 shrink-0 opacity-50' />
        <CommandPrimitive.Input
            ref={ref}
            className={cn(
                'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            {...restProps}
        />
        {children}
    </div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = forwardRef<
  ElementRef<typeof CommandPrimitive.List>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...restProps }, ref) => (
    <CommandPrimitive.List
        ref={ref}
        className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
        {...restProps}
    />
))
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = forwardRef<
  ElementRef<typeof CommandPrimitive.Empty>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
    <CommandPrimitive.Empty
        ref={ref}
        className='py-6 text-center text-sm'
        {...props}
    />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = forwardRef<
  ElementRef<typeof CommandPrimitive.Group>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...restProps }, ref) => (
    <CommandPrimitive.Group
        ref={ref}
        className={cn(
            'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
            className,
        )}
        {...restProps}
    />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = forwardRef<
  ElementRef<typeof CommandPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...restProps }, ref) => (
    <CommandPrimitive.Separator
        ref={ref}
        className={cn('-mx-1 h-px bg-border', className)}
        {...restProps}
    />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = forwardRef<
    ElementRef<typeof CommandPrimitive.Item>,
    ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
    <CommandPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-[selected='true']:bg-accent aria-[selected='true']:text-accent-foreground data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50",
            className,
        )}
        {...props}
    />
))
CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
    className,
    ...restProps
}: HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(
                'ml-auto text-xs tracking-widest text-muted-foreground',
                className,
            )}
            {...restProps}
        />
    )
}
CommandShortcut.displayName = 'CommandShortcut'

export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
    CommandLoading,
}
