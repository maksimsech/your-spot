import { redirect } from 'next/navigation'

import { config } from '@your-spot/auth'

import { auth } from '@/auth'
import { Logo } from '@/components/auth/logo'
import { Separator } from '@/components/ui/separator'

import { SignInButton } from './sign-in-button'



export default async function Page() {
    const session = await auth()
    if (session?.user) {
        redirect('/')
    }

    return (
        <div className='container flex h-full flex-col justify-center'>
            <div className='mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]'>
                <div className='flex flex-col gap-2 text-center'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Sign in with your account</h1>
                    <span className='text-muted-foreground text-sm'>Choose one of available options below</span>
                </div>
                <Separator />
                <div className='flex flex-col items-stretch gap-2'>
                    {config.providers.map(p => {
                        return (
                            <SignInButton
                                key={p.id}
                                id={p.id}
                                name={p.name}
                            >
                                <Logo
                                    logo={p?.style?.logo}
                                    logoDark={p?.style?.logoDark}
                                />
                            </SignInButton>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
