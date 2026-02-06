import React from "react"
import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartDrawer } from '@/components/cart-drawer'
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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
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
        <CartDrawer />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
