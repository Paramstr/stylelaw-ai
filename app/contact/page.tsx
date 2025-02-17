import { NavHeader } from '../components/nav-header'
import Link from 'next/link'
import { Mail, Linkedin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavHeader title="DONNA" />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl font-serif mb-12 text-center">Get in Touch</h1>
        
        <div className="max-w-xl mx-auto space-y-8">
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
            <div className="space-y-6">
              <Link 
                href="mailto:paramstr@gmail.com"
                className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors p-4 rounded-lg hover:bg-gray-800 border border-transparent hover:border-gray-700"
              >
                <Mail className="w-6 h-6" />
                <span className="text-lg">paramstr@gmail.com</span>
              </Link>

              <Link 
                href="https://www.linkedin.com/in/parambir-singh-769736159/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors p-4 rounded-lg hover:bg-gray-800 border border-transparent hover:border-gray-700"
              >
                <Linkedin className="w-6 h-6" />
                <span className="text-lg">Connect on LinkedIn</span>
              </Link>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm">
            We typically respond within 24 hours
          </p>
        </div>
      </main>
    </div>
  )
} 