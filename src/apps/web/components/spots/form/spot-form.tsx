'use client'

import {
    FormEvent,
    useId,
} from 'react'

import {
    useRouter,
    useSearchParams,
} from 'next/navigation'

import { createSpot } from ':actions/spots'

import './spot-form.scss'


export function SpotForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const titleId = useId()
    const descriptionId = useId()

    const lat = searchParams.get('lat') != null ? parseFloat(searchParams.get('lat')!) : null
    const lng = searchParams.get('lng') != null ? parseFloat(searchParams.get('lng')!) : null
    if (lat == null || lng == null) {
        router.back()
    }

    async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        await createSpot({
            title: formData.get('title')!.toString(),
            description: formData.get('description')!.toString(),
            coordinate: {
                lat: lat!,
                lng: lng!,
            },
        })

        router.push('/')
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <div>
                <label htmlFor={titleId}>Title</label>
                <input id={titleId} name='title' />
            </div>
            <div>
                <label htmlFor={descriptionId}>Description</label>
                <input id={descriptionId} name='description' />
            </div>
            <button type='submit'>Save</button>
        </form>
    )
}
