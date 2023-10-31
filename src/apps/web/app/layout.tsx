import { clsx } from 'clsx'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ThemeProvider } from '@/components/providers/theme'
import { LayoutProps } from '@/types/layout-props'

import './globals.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Your spot',
    description: 'Find and mark your favorite spots!',
}

export default function RootLayout({ children }: LayoutProps) {
    return (
        <html
            lang='en'
            suppressHydrationWarning
        >
            <body className={clsx(inter.className, 'flex h-[100vh] flex-col')}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
