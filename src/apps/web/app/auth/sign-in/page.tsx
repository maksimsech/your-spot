import type { SignInPageErrorParam } from '@auth/core/types'
import { redirect } from 'next/navigation'

import { config } from '@your-spot/auth'

import { getAuthorizedUser } from '@/auth/helper'
import { Logo } from '@/components/auth/logo'
import { Separator } from '@/components/ui/separator'

import { Button } from './_components/button'


type ErrorType = SignInPageErrorParam | 'Default'

// Error key and messages from @auth/core signin page
const defaultMessage = 'Unable to sign in.'
const errorMessages: Partial<Record<ErrorType, string>> = {
    'Default': defaultMessage,
    'Signin': 'Try signing in with a different account.',
    'OAuthSignin': 'Try signing in with a different account.',
    'OAuthCallbackError': 'Try signing in with a different account.',
    'OAuthCreateAccount': 'Try signing in with a different account.',
    'EmailCreateAccount': 'Try signing in with a different account.',
    'Callback': 'Try signing in with a different account.',
    'OAuthAccountNotLinked': 'To confirm your identity, sign in with the same account you used originally.',
    'EmailSignin': 'The e-mail could not be sent.',
    'CredentialsSignin': 'Sign in failed. Check the details you provided are correct.',
    'SessionRequired': 'Please sign in to access this page.',
}

interface PageProps {
    searchParams?: {
        error?: SignInPageErrorParam | 'Default'
    }
}

export default async function Page({
    searchParams,
}: PageProps) {
    const user = await getAuthorizedUser()
    if (user) {
        redirect('/')
    }

    const errorMessage = searchParams?.error
        ? errorMessages[searchParams.error] ?? defaultMessage
        : null

    return (
        <div className='container flex h-full flex-col justify-center'>
            <div className='mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]'>
                <div className='flex flex-col gap-2 text-center'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Sign in with your account</h1>
                    <span className='text-muted-foreground text-sm'>Choose one of available options below</span>
                </div>
                <Separator />
                <div className='flex flex-col items-stretch gap-2'>
                    {config.providers.map(p => (
                        <Button
                            key={p.id}
                            id={p.id}
                            name={p.name}
                        >
                            <Logo
                                logo={p?.style?.logo}
                                logoDark={p?.style?.logoDark}
                            />
                        </Button>
                    ))}
                </div>
                {errorMessage && (
                    <div className='text-destructive text-center'>
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    )
}
