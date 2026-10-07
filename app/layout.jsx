import './globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  metadataBase: new URL('https://www.mentatcommons.com'),
  title: 'Mentat Commons — Designing decisions for collective intelligence',
  description: 'Mentat Commons — a studio and lab combining data systems, facilitation, and storytelling to help organizations think together.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mentat Commons — Designing decisions for collective intelligence',
    description: 'Mentat Commons — a studio and lab combining data systems, facilitation, and storytelling to help organizations think together.',
    url: 'https://www.mentatcommons.com',
    siteName: 'Mentat Commons',
    images: [
      {
        url: '/images/mentat-commons-og.png',
        width: 1200,
        height: 630,
        alt: 'Mentat Commons — Designing decisions for collective intelligence',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mentat Commons — Designing decisions for collective intelligence',
    description: 'Mentat Commons — a studio and lab combining data systems, facilitation, and storytelling to help organizations think together.',
    images: ['/images/mentat-commons-og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#030712',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between antialiased">
        <div>
          <header className="border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50 py-5">
            <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-0">
              <div>
                <h1 className="text-xl font-bold text-slate-50 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full inline-block"></span>
                  Mentat Commons
                </h1>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Designing decisions for collective intelligence</p>
              </div>
              <nav className="flex flex-wrap gap-y-2">
                <a className="header-link text-xs font-semibold" href="/">Home</a>
                <a className="header-link text-xs font-semibold" href="/about">About</a>
                <a className="header-link text-xs font-semibold" href="/services">Services</a>
                <a className="header-link text-xs font-semibold" href="/portfolio">Portfolio</a>
                <a className="header-link text-xs font-semibold" href="/training">Consulting</a>
                <a className="header-link text-xs font-semibold" href="/narrative">Narrative Research</a>
                <a className="header-link text-xs font-semibold" href="/faq">FAQ</a>
                <a className="header-link text-xs font-semibold" href="/career">Career Explorer</a>
              </nav>
            </div>
          </header>
          <main className="py-8">{children}</main>
        </div>
        <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
          <div className="container py-0">
            <p>© 2026 Mentat Commons — Bene Data Collective • Mentat Theatre • Desert Intelligence • Sietch Protocol</p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}

