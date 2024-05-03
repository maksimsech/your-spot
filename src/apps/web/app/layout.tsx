import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { redirect } from 'next/navigation'

import { getAuthenticatedUser } from '@/auth/helper'
import { CurrentBoundsProvider } from '@/components/map'
import { ThemeProvider } from '@/components/providers/theme'
import { Toaster } from '@/components/ui/toast'
import { isFeatureEnabled } from '@/feature-flags'
import type { LayoutProps } from '@/types/layout-props'

import './globals.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Your spot',
    description: 'Find and mark your favorite spots!',
}

export default async function RootLayout({ children }: LayoutProps) {
    const signInEnabled = await isFeatureEnabled('user_sign_in')
    if (!signInEnabled) {
        const user = await getAuthenticatedUser()
        if (user) {
            redirect('/auth/sign-out')
        }
    }

    return (
        <html
            lang='en'
            suppressHydrationWarning
        >
            <body className={inter.className}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    <CurrentBoundsProvider>
                        <div className='flex h-dvh flex-col'>
                            {children}
                        </div>
                    </CurrentBoundsProvider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}
