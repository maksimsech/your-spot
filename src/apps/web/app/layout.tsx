import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ThemeProvider } from '@/components/providers/theme'
import { Toaster } from '@/components/ui/toast'
import type { LayoutProps } from '@/types/layout-props'

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
            <body className={inter.className}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className='flex h-dvh flex-col'>
                        {children}
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    )
}
