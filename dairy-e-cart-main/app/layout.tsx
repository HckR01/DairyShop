import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CartProvider } from '@/contexts/cart-context'
import { AuthProvider } from '@/contexts/auth-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import { SplashScreen } from '@/components/splash-screen'
import { PWARegister } from '@/components/pwa-register'
import { ResponsivePwaShell } from '@/components/mobile-pwa-app'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'DairyFresh - Farm Fresh Dairy Products',
  description: 'Get farm-fresh dairy products delivered to your doorstep. Fresh milk, yogurt, cheese, and more with subscription options.',
  keywords: ['dairy', 'milk', 'fresh', 'organic', 'delivery', 'subscription'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DairyFresh',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'DairyFresh',
    title: 'DairyFresh - Farm Fresh Dairy Products',
    description: 'Get farm-fresh dairy products delivered to your doorstep.',
  },
  twitter: {
    card: 'summary',
    title: 'DairyFresh - Farm Fresh Dairy Products',
    description: 'Get farm-fresh dairy products delivered to your doorstep.',
  },
}

export const viewport: Viewport = {
  themeColor: '#11422C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <PWARegister />
        <SplashScreen />
        <AuthProvider>
          <CartProvider>
            <ResponsivePwaShell header={<Header />} footer={<Footer />}>
              {children}
            </ResponsivePwaShell>
            <Toaster />
          </CartProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
