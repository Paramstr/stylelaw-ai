import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="w-full p-6 text-gray-500 text-sm bg-black">
      <div className="flex flex-col md:flex-row gap-4 justify-end">
        <Link href="/careers" className="hover:text-white transition-colors">
          Careers
        </Link>
        <Link href="/terms" className="hover:text-white transition-colors">
          Terms & Conditions
        </Link>
        <Link href="/privacy" className="hover:text-white transition-colors">
          Privacy Policy
        </Link>
      </div>
    </footer>
  )
}

