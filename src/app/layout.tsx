import type { Metadata } from 'next'
import { Roboto_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import AppShell from '@/components/AppShell'
import StyledComponentsRegistry from '@/components/StyledComponentsRegistry'
import nextConfig from '../../next.config'

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  applicationName: 'Tower of Ivory',
  title: {
    default: 'Tower of Ivory - Unofficial database for Harbor C1 X1 server',
    template: '%s | Tower of Ivory',
  },
  description:
    'A database of items, skills, and other information from the Harbor client. Not affiliated with the Harbor project.',
  keywords: [
    'Harbor',
    'Tower of Ivory',
    'C1 X1',
    'database',
    'items',
    'skills',
    'information',
    'ElmoreLab',
    'Harbingers of War',
    'Lineage 2',
    'Lineage II',
  ],
  icons: { icon: `${nextConfig.basePath || ''}/favicon.ico` },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={robotoMono.className}>
        <StyledComponentsRegistry>
          <AppShell basePath={nextConfig.basePath}>{children}</AppShell>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
