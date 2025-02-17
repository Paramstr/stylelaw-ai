import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="w-full p-6 text-gray-300 text-sm bg-black">
      <div className="flex flex-col md:flex-row gap-4 justify-end">
        <div className="hover:text-white transition-colors">
          <Link href="https://github.com/paramsingh" target="_blank" rel="noopener noreferrer">
            Made By Param
          </Link>
        </div>
      </div>
    </footer>
  )
}

