import { Button } from "@/components/ui/button"

interface CitationButtonProps {
  paragraphs?: number[]
  onParagraphClick?: (paragraph: number) => void
}

export function CitationButton({ paragraphs, onParagraphClick }: CitationButtonProps) {

  if (!paragraphs || paragraphs.length === 0) {
    return null
  }

  const handleClick = (para: number) => {
    console.log('CitationButton: Button clicked for paragraph:', para);
    onParagraphClick?.(para);
  };

  return (
    <div className="inline-flex gap-1 ml-2">
      {paragraphs.map((para) => (
        <Button
          key={para}
          variant="outline"
          size="sm"
          className="px-1.5 py-0.5 h-5 text-[11px] bg-emerald-50/50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300 transition-colors"
          onClick={() => handleClick(para)}
        >
          {para}
        </Button>
      ))}
    </div>
  )
}

