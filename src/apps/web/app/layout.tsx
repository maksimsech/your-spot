import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { BaseLayout } from ':components/layouts/base-layout'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Your spot',
    description: 'Find and mark your favorite spots!',
}

export default function RootLayout({
    children,
}: {
  children: React.ReactNode
}) {
    return (
        <html lang='en'>
            <body className={inter.className}>
                <BaseLayout>
                    {children}
                </BaseLayout>
            </body>
        </html>
    )
}
