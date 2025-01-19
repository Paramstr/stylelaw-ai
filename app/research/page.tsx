import { NavHeader } from '../components/nav-header'
import { SiteFooter } from '../components/site-footer'
import { FilterSection } from '../components/filter-section'
import { SearchBar } from '../components/search-bar'

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-white text-black relative">
      <NavHeader title="DONNA | RESEARCH" />
      
      <main className="flex-1 flex items-center min-h-screen pt-16">
        <div className="max-w-7xl w-full mx-auto space-y-6 flex flex-col items-center px-6 lg:px-12 -mt-64">
          <FilterSection />
          <SearchBar />
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0">
        <div className="h-32 bg-cover bg-center" />
        <SiteFooter />
      </div>
    </div>
  )
}

