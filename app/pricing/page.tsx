import { NavHeader } from '../components/nav-header'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavHeader title="DONNA" />
      <main className="container mx-auto px-6 py-12 flex items-center justify-center">
        <div className="bg-neutral-900 p-12 rounded-xl max-w-2xl w-full shadow-2xl border border-neutral-800">
          <div className="text-center space-y-6">
            <div className="inline-block bg-neutral-800 text-neutral-300 px-4 py-2 rounded-full text-sm font-medium border border-neutral-700">
              Technical Preview
            </div>
            
            <h1 className="text-3xl font-serif">Currently Free Access</h1>
            
            <p className="text-neutral-300 text-lg leading-relaxed">
              Donna is currently in technical preview, offering full access to all features at no cost.
            </p>

            <div className="pt-6">
              <Link 
                href="/research"
                className="inline-flex items-center justify-center bg-neutral-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-neutral-700 transition-colors"
              >
                Start Using Now
              </Link>
            </div>

            <p className="text-sm text-neutral-400 mt-6">
              Pricing plans will be announced when we exit technical preview
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 