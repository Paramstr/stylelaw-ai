import { Button } from "@/components/ui/button"
import { useState, useCallback } from 'react'

interface CitationButtonProps {
  citation?: string
  paragraphs?: number[]
  onParagraphClick?: (paragraph: number) => void
}

export function CitationButton({ citation, paragraphs, onParagraphClick }: CitationButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyClick = useCallback(async () => {
    if (citation) {
      await navigator.clipboard.writeText(citation)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [citation])

  const handleParagraphClick = useCallback((paragraph: number) => {
    if (onParagraphClick) {
      onParagraphClick(paragraph)
    }
  }, [onParagraphClick])

  if (paragraphs) {
    return (
      <div className="flex flex-wrap gap-2">
        {paragraphs.map((paragraph) => (
          <Button
            key={paragraph}
            variant="outline"
            size="sm"
            onClick={() => handleParagraphClick(paragraph)}
            className="text-xs h-6 px-2 py-0 rounded-sm border-black/20 hover:bg-black hover:text-white"
          >
            ¶{paragraph}
          </Button>
        ))}
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopyClick}
      className="text-xs h-6 px-2 py-0 rounded-sm border-black/20 hover:bg-black hover:text-white"
    >
      {copied ? 'Copied!' : citation}
    </Button>
  )
}

