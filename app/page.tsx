import { NavHeader } from './components/nav-header'
import { SiteFooter } from './components/site-footer'
import { HomeFeatures } from './components/home-features'
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <NavHeader title="DONNA" />
      
      <main className="flex-1 pt-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl mb-8 font-serif max-w-4xl pb-8 mx-auto">
              <span className="text-white">Every Harvey needs a</span>{' '}
              <span className="text-white">Donna.</span>
            </h1>
            <Link 
              href="/research" 
              className="inline-block text-white text-lg hover:opacity-80 transition-opacity mb-24 border-b border-white pb-1"
            >
              → Research Preview
            </Link>
          </div>

          {/* Features Section */}
          <div className="relative">
            <div className="relative w-full aspect-square mb-12 max-w-xl mx-auto overflow-visible">
              <Image
                src="/landing.png"
                alt="Historic courthouse interior"
                fill
                sizes="(max-width: 576px) 100vw, 576px"
                className="object-cover opacity-30"
                priority
              />
              <HomeFeatures />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

