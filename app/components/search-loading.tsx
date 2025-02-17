import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

export type SearchProgress = {
  queryStarted: boolean;
  upstashComplete: boolean;
  metadataStarted: boolean;
  metadataComplete: boolean;
  complete: boolean;
}

const loadingMessages = [
  {
    message: "Sending query to neural search engine...",
    requiredState: "queryStarted"
  },
  {
    message: "Retrieving relevant case documents...",
    requiredState: "upstashComplete"
  },
  {
    message: "Analyzing case details...",
    requiredState: "metadataStarted"
  },
  {
    message: "Processing case details...",
    requiredState: "metadataComplete"
  },
  {
    message: "Preparing results...",
    requiredState: "complete"
  }
]

interface SearchLoadingProps {
  progress: SearchProgress;
}

export function SearchLoading({ progress }: SearchLoadingProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [shouldShow, setShouldShow] = useState(true)

  // Get the highest progress state that is true
  const getCurrentProgressIndex = useCallback(() => {
    if (progress.complete) return loadingMessages.length - 1;
    if (progress.metadataComplete) return 3;
    if (progress.metadataStarted) return 2;
    if (progress.upstashComplete) return 1;
    if (progress.queryStarted) return 0;
    return -1;
  }, [progress]);

  useEffect(() => {
    const targetIndex = getCurrentProgressIndex();
    if (targetIndex > currentMessageIndex) {
      // Add a small delay before showing next message
      const timeout = setTimeout(() => {
        setCurrentMessageIndex(targetIndex);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [progress, currentMessageIndex, getCurrentProgressIndex]);

  // When complete, wait a bit before hiding
  useEffect(() => {
    if (progress.complete) {
      const timeout = setTimeout(() => {
        setShouldShow(false);
      }, 2000); // Linger for 2 seconds after completion
      return () => clearTimeout(timeout);
    }
  }, [progress.complete]);

  if (!shouldShow) return null;

  return (
    <motion.div 
      className="mt-24 flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md space-y-4 bg-white/50 backdrop-blur-sm p-6">
        <AnimatePresence mode="popLayout">
          {loadingMessages.slice(0, currentMessageIndex + 1).map((messageObj, index) => (
            <motion.div
              key={messageObj.message}
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
              {messageObj.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 