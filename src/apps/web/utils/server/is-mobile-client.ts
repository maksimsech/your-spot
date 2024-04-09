import { cache } from 'react'

import { headers } from 'next/headers'
import { userAgent } from 'next/server'


export const isMobileClient = cache(() => {
    const { device } = userAgent({
        headers: headers(),
    })

    return device.type === 'mobile'
})
