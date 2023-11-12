'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { deleteSpot } from '@/actions/spots'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import { useToast } from '@/components/ui/toast'


interface DeleteDialogProps {
    id: string
    title: string
}

export function DeleteDialog({
    id,
    title,
}: DeleteDialogProps) {
    const router = useRouter()
    const { toast } = useToast()

    const [deleting, setDeleting] = useState(false)

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant='outline'>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {deleting ? (
                            <div className='flex justify-center'>
                                <Loader />
                            </div>
                        ) : (
                            <>
                                This action cannot be undone. This will permanently delete spot.
                            </>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={deleting}
                        onClick={async (e) => {
                            setDeleting(true)
                            e.preventDefault()

                            await deleteSpot(id)

                            toast({
                                title: 'Spot deleted',
                                description: `${title} successfully deleted!`,
                            })
                            router.push('/?action=refresh')
                        }}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
