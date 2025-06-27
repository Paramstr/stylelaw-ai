import Link from 'next/link'

interface NavHeaderProps {
  title: string
}

export function NavHeader({ title }: NavHeaderProps) {
  return (
    <header className="sticky top-0 bg-black z-50">
      <nav className="flex justify-between items-center px-4 py-4 lg:px-12">
        <Link href="/" className="text-white font-serif flex-shrink-0">
          <span className="text-lg sm:text-2xl">{title}</span>
        </Link>
        
        {/* Navigation links with responsive spacing */}
        <div className="flex gap-3 sm:gap-6 lg:gap-8 text-xs sm:text-sm text-gray-100 ml-2 sm:ml-4 flex-shrink-0">
          <Link href="/about" className="hover:text-white transition-colors whitespace-nowrap">
            ABOUT
          </Link>
          <Link href="/pricing" className="hover:text-white transition-colors whitespace-nowrap">
            PRICING
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors whitespace-nowrap">
            CONTACT
          </Link>
        </div>
      </nav>
    </header>
  )
}

