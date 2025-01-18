import { NavHeader } from '../components/nav-header'
import { SiteFooter } from '../components/site-footer'
import { FilterSection } from '../components/filter-section'
import { SearchBar } from '../components/search-bar'

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-white text-black relative">
      <NavHeader title="DONNA | RESEARCH" />
      
      <main className="pt-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <div className="w-[250px] shrink-0 border border-black">
              <FilterSection />
            </div>
            <div className="flex-1">
              <SearchBar />
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0">
        <div className="h-32 bg-cover bg-center" />
        <SiteFooter />
      </div>
    </div>
  )
}

