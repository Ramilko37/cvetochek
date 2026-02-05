import React from "react"
import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import '@/styles/globals.css'

import { Cormorant_Garamond, Inter, Inter as V0_Font_Inter, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _inter = V0_Font_Inter({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600"],
  variable: '--font-cormorant'
});

export const metadata: Metadata = {
  title: 'Цветочек в Горшочек | Доставка цветов в Москве',
  description: 'Изысканные букеты и цветочные композиции с доставкой по Москве. Создаём с любовью.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        {children}
        <Footer />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
