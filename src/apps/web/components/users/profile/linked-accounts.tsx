import { config } from '@your-spot/auth'
import { getUserAccounts } from '@your-spot/core'

import { getAccountUrl } from '@/auth/helper'
import { Logo } from '@/components/auth/logo'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utils'


interface LinkedAccountsProps {
    id: string
}

export async function LinkedAccounts({ id }: LinkedAccountsProps) {
    const accounts = await getUserAccounts(id)

    if (!accounts) {
        // Should be at least one.. Smth got wrong..
        return null
    }

    return (
        <div className='grid grid-cols-2 gap-2'>
            {accounts.map(a => {
                const providerConfig = config.providers.find(p => p.id === a.provider)
                if (!providerConfig) {
                    // Don't show unused login providers
                    return null
                }

                const accountUrl = getAccountUrl(a)

                return (
                    <a
                        key={providerConfig.id}
                        className={cn(buttonVariants({ variant: 'outline', className: 'flex gap-2 p-3' }))}
                        href={accountUrl}
                        target='_blank'
                    >
                        <Logo
                            logo={providerConfig.style?.logo}
                            logoDark={providerConfig.style?.logoDark}
                        />
                        <span>
                            {providerConfig.name}
                        </span>
                    </a>
                )
            })}
        </div>
    )
}
