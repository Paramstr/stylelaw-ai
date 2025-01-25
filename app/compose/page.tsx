import { NavHeader } from '@/components/nav-header'

export default function ComposePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader title="DONNA | COMPOSE" />
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Coming Soon</h1>
          <p className="text-muted-foreground">
            Our drafting assistant is currently in development. Check back later!
          </p>
        </div>
      </div>
    </div>
  )
}

// Original implementation below (for future reference):
// 'use client'

// import 'iframe-resizer/js/iframeResizer.contentWindow'
// import { useCallback, useEffect, useState } from 'react'

// import { BlockEditor } from '../components/BlockEditor'
// import { createPortal } from 'react-dom'
// import { Surface } from '../components/ui/Surface'
// import { Toolbar } from '../components/ui/Toolbar'
// import { Icon } from '../components/ui/Icon'
// import { NavHeader } from '@/components/nav-header'

// const useDarkmode = () => {
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(
//     typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false,
//   )

//   useEffect(() => {
//     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
//     const handleChange = () => setIsDarkMode(mediaQuery.matches)
//     mediaQuery.addEventListener('change', handleChange)
//     return () => mediaQuery.removeEventListener('change', handleChange)
//   }, [])

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', isDarkMode)
//   }, [isDarkMode])

//   const toggleDarkMode = useCallback(() => setIsDarkMode(isDark => !isDark), [])
//   const lightMode = useCallback(() => setIsDarkMode(false), [])
//   const darkMode = useCallback(() => setIsDarkMode(true), [])

//   return {
//     isDarkMode,
//     toggleDarkMode,
//     lightMode,
//     darkMode,
//   }
// }

// export default function Document() {
//   const { isDarkMode, darkMode, lightMode } = useDarkmode()
//   const [aiToken, setAiToken] = useState<string | null | undefined>()

//   useEffect(() => {
//     // fetch data
//     const dataFetch = async () => {
//       try {
//         const response = await fetch('/api/ai', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         })

//         if (!response.ok) {
//           throw new Error('No AI token provided, please set TIPTAP_AI_SECRET in your environment')
//         }
//         const data = await response.json()

//         const { token } = data

//         // set state when the data received
//         setAiToken(token)
//       } catch (e) {
//         if (e instanceof Error) {
//           console.error(e.message)
//         }
//         setAiToken(null)
//         return
//       }
//     }

//     dataFetch()
//   }, [])

//   if (aiToken === undefined) return null

//   const DarkModeSwitcher = createPortal(
//     <Surface className="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1">
//       <Toolbar.Button onClick={lightMode} active={!isDarkMode}>
//         <Icon name="Sun" />
//       </Toolbar.Button>
//       <Toolbar.Button onClick={darkMode} active={isDarkMode}>
//         <Icon name="Moon" />
//       </Toolbar.Button>
//     </Surface>,
//     document.body,
//   )

//   return (
//     <>
//       {DarkModeSwitcher}
//       <NavHeader title="DONNA | COMPOSE" />
//       <BlockEditor aiToken={aiToken ?? undefined} />
//     </>
//   )
// }
