import { NavHeader } from '../components/nav-header'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavHeader title="DONNA" />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif mb-8">Revolutionizing Legal Research</h1>
        
        <div className="space-y-6 text-gray-300">
          <p className="text-lg leading-relaxed">
            Legal case search has remained stagnant for decades, bound by outdated interfaces and inefficient workflows. Donna is changing that.
          </p>
          
          <p className="text-lg leading-relaxed">
            We&apos;re bringing legal research into the future with cutting-edge AI technology, making it faster, more intuitive, and more insightful than ever before.
          </p>

          <div className="bg-gray-900 p-8 rounded-lg mt-12 border border-gray-700">
            <h2 className="text-2xl font-serif mb-4">Our Vision</h2>
            <p className="text-lg leading-relaxed">
              We envision a world where legal professionals can focus on analysis and strategy, not wrestling with search tools. Our AI-powered platform understands context, finds relevant cases faster, and presents information in a clear, actionable format.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg mt-6 border border-gray-600">
            <h2 className="text-2xl font-serif mb-4">Key Benefits</h2>
            <ul className="list-disc list-inside space-y-3">
              <li>AI-powered semantic search that understands legal context</li>
              <li>Modern, intuitive interface designed for efficiency</li>
              <li>Comprehensive case analysis and summarization</li>
              <li>Time-saving features for legal professionals</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
} 