'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { FeatureCard } from './feature-card'

export function HomeFeatures() {
  const router = useRouter()

  const handleResearchClick = useCallback(() => {
    router.push('/research')
  }, [router])

  const handleComposeClick = useCallback(() => {
    router.push('/compose')
  }, [router])

  return (
    <div className="relative">
      <div className="relative w-full aspect-square mb-12 max-w-xl mx-auto overflow-visible">
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <div className="absolute -right-16 top-[15%] z-20 w-full max-w-[90%] md:max-w-md">
              <FeatureCard
                label="Legal Search With Agents"
                title="RESEARCH"
                description="Combs through millions of cases to find what you need, just as a legal researcher would - but in seconds instead of hours."
                onClick={handleResearchClick}
                className="text-left"
              />
            </div>
            
            <div className="absolute -left-16 bottom-[15%] z-10 w-full max-w-[90%] md:max-w-md">
              <FeatureCard
                label="Drafting Assistant"
                title="COMPOSE"
                description="Crafts perfect citations and suggests winning precedents as you write, swiftly turning good briefs into legal masterpieces."
                dark
                alignRight
                onClick={handleComposeClick}
                tryButtonPosition="left"
                tryButtonText="Beta"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 