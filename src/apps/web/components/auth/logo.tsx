/* eslint-disable @next/next/no-img-element */
import { clsx } from 'clsx'

import { getOauthProviderLogoUrls } from '@/auth/helper'


interface LogoProps {
    className?: string
    logo?: string
    logoDark?: string
}

export function Logo({
    className,
    logo: propLogo,
    logoDark: propLogoDark,
}: LogoProps) {
    const {
        logo,
        logoDark,
    } = getOauthProviderLogoUrls(propLogo, propLogoDark)

    const baseIconClass = 'mr-2 h-4 w-4'

    const logoClass = logoDark
        ? 'dark:hidden'
        : undefined

    const logoDarkClass = logo
        ? 'hidden dark:visible'
        : undefined

    return (
        <>
            {logo && (
                <img
                    className={clsx(baseIconClass, { logoClass }, className)}
                    loading='lazy'
                    src={logo}
                    alt='Provider logo'
                />
            )}
            {logoDark && (
                <img
                    className={clsx(baseIconClass, { logoDarkClass }, className)}
                    loading='lazy'
                    src={logoDark}
                    alt='Provider logo'
                />
            )}
        </>
    )
}
