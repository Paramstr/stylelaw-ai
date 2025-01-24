import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

const loadingMessages = [
  "Initializing search...",
  "Scanning through Family Court cases...",
  "Analyzing case precedents...",
  "Cross-referencing jurisdictions...",
  "Processing citations...",
  "Extracting key legal principles...",
  "Applying relevance filters...",
  "Building response...",
]

export function SearchLoading() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [shouldShow, setShouldShow] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentMessageIndex < loadingMessages.length - 1) {
        setCurrentMessageIndex(prev => prev + 1)
      } else if (!isDone) {
        setIsDone(true)
        // Wait a bit before starting the fade out
        setTimeout(() => {
          setShouldShow(false)
        }, 1000)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [currentMessageIndex, isDone])

  if (!shouldShow) return null

  return (
    <motion.div 
      className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md w-full space-y-4">
        <AnimatePresence mode="popLayout">
          {loadingMessages.slice(0, currentMessageIndex + 1).map((message, index) => (
            <motion.div
              key={message}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 text-sm text-gray-600"
            >
              {index < currentMessageIndex ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
              )}
              {message}
            </motion.div>
          ))}
        </AnimatePresence>
        
        <AnimatePresence>
          {isDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 text-sm text-green-600 font-medium"
            >
              <Check className="w-4 h-4" />
              Done!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 