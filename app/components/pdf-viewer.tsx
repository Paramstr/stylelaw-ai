// components/PDFViewer.tsx
'use client';

import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { searchPlugin } from '@react-pdf-viewer/search';
import { useEffect, useRef } from 'react';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';

interface PDFViewerProps {
  fileUrl?: string;
  base64Data?: string;
  searchQuery?: string;
}

export default function PDFViewer({ fileUrl, base64Data, searchQuery }: PDFViewerProps) {
  const lastSearchQuery = useRef(searchQuery);
  const isSearching = useRef(false);

  const searchPluginInstance = searchPlugin({
    onHighlightKeyword: (props) => {
      if (isSearching.current) {
        const highlightElements = document.querySelectorAll('.rpv-search__highlight');
        if (highlightElements.length > 0) {
          const element = highlightElements[0] as HTMLElement;
          
          // Get the PDF container element
          const container = document.querySelector('.rpv-default-layout__body');
          
          if (container) {
            // Calculate position with 50px offset
            const elementRect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const scrollOffset = elementRect.top - containerRect.top - 50;
            
            // Smooth scroll with offset
            container.scrollBy({
              top: scrollOffset,
              behavior: 'smooth'
            });
          }
        }
        isSearching.current = false;
      }
    },
  });

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [],
  });

  // Use effect to trigger search when searchQuery changes
  useEffect(() => {
    if (searchQuery && searchQuery !== lastSearchQuery.current) {
      isSearching.current = true;
      lastSearchQuery.current = searchQuery;
      searchPluginInstance.highlight(`[${searchQuery}]`);
    }
  }, [searchQuery, searchPluginInstance]);

  // Create file URL from base64 if provided
  const pdfUrl = base64Data 
    ? `data:application/pdf;base64,${base64Data}`
    : fileUrl;

  if (!pdfUrl) {
    return <div className="text-red-500 p-4">No PDF source provided.</div>;
  }

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
      <div className="w-full h-[calc(100vh-350px)] border border-gray-200 overflow-hidden">
        <Viewer
          fileUrl={pdfUrl}
          plugins={[defaultLayoutPluginInstance, searchPluginInstance]}
          theme="dark"
          defaultScale={SpecialZoomLevel.PageWidth}
          renderError={() => (
            <div className="text-red-500 p-4">
              Failed to load PDF. Please check the file URL.
            </div>
          )}
          renderLoader={() => (
            <div className="animate-pulse p-4 text-gray-400">
              Loading document...
            </div>
          )}
        />
      </div>

      <style jsx global>{`
        /* Target the PDF viewer's internal classes */
        .rpv-core__inner-page {
          width: 100% !important;
          margin: 0 auto;
          padding: 0 !important;
        }
        
        .rpv-default-layout__container {
          border: none !important;
        }
        
        .rpv-default-layout__body {
          padding: 0 !important;
        }
        
        .rpv-core__page-layer {
          box-shadow: none !important;
        }
      `}</style>
    </Worker>
  );
}