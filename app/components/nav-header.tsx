import Link from 'next/link'

interface NavHeaderProps {
  title: string
}

export function NavHeader({ title }: NavHeaderProps) {
  return (
    <header className="sticky top-0 bg-black z-50">
      <nav className="flex justify-between items-center px-6 py-4 lg:px-12">
        <Link href="/" className="text-white text-2xl font-serif">
          {title}
        </Link>
        <div className="flex gap-8 text-sm text-gray-100">
          <Link href="/about" className="hover:text-white transition-colors">
            ABOUT
          </Link>
          <Link href="/pricing" className="hover:text-white transition-colors">
            PRICING
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            CONTACT
          </Link>
        </div>
      </nav>
    </header>
  )
}

