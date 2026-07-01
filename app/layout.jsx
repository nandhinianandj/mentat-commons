import './globals.css'
import Head from 'next/head'

export const metadata = {
  title: 'Mentat Commons — Designing decisions for collective intelligence',
  description: 'Mentat Commons — a studio and lab combining data systems, facilitation, and storytelling to help organizations think together.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
        <meta property="og:image" content="/images/mentat-commons-og.png" />
      </Head>
      <body>
        <header className="bg-navy text-white py-8">
          <div className="container">
            <h1 className="text-2xl font-semibold">Mentat Commons</h1>
            <p className="text-sm text-muted">Designing decisions for collective intelligence</p>
            <nav className="mt-4">
              <a className="mr-4" href="/">Home</a>
              <a className="mr-4" href="/about">About</a>
              <a className="mr-4" href="/axis1">Bene Data Collective</a>
              <a className="mr-4" href="/axis2">Mentat Theatre</a>
              <a className="mr-4" href="/training">Training</a>
              <a className="mr-4" href="/career">Career KB</a>
              <a href="/links">Links</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-navy text-white py-6 mt-12 text-center">
          <div className="container">
            <p>© 2025 Mentat Commons — Bene Data Collective • Mentat Theatre • Desert Intelligence • Sietch Protocol</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

