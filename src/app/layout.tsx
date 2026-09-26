import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: {
    default: 'GUSA – Gusii University Students Association – Meru',
    template: '%s | GUSA'
  },
  description: 'Official platform for the Gusii University Students Association at Meru. Building Community. Celebrating Culture. Empowering Students.',
  keywords: ['GUSA', 'Gusii', 'Students', 'Association', 'Meru', 'University'],
  openGraph: {
    title: 'GUSA – Gusii University Students Association – Meru',
    description: 'Building Community. Celebrating Culture. Empowering Students.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
