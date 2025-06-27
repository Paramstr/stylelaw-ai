'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function MobileAlert() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user has previously dismissed the alert
    const dismissed = localStorage.getItem('mobile-alert-dismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Show alert on mobile screens
    const checkScreenSize = () => {
      setIsVisible(window.innerWidth < 768) // md breakpoint
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('mobile-alert-dismissed', 'true')
  }

  if (!isVisible || isDismissed) {
    return null
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-800">
              <strong>Best viewing experience on desktop.</strong> Some features may be limited on mobile devices.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 flex-shrink-0 text-yellow-500 hover:text-yellow-700 focus:outline-none"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
} 