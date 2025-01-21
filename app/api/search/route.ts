// // pages/api/search.ts
// import { upstashClient } from '@/lib/research/upstash'
// import { supabaseClient } from '@/lib/research/supabase'
// import type { NextApiRequest, NextApiResponse } from 'next'

// type SearchResult = {
//   id: string
//   score: number
//   metadata: {
//     pdfPath: string
//     filename: string
//   }
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' })
//   }

//   const { query, mode } = req.body

//   try {
//     // Search Upstash BM25 index
//     const searchResults = await upstashClient.ft('legal-docs', query, {
//       LIMIT: {
//         from: 0,
//         size: 10
//       }
//     }) as SearchResult[]

//     // Get signed URLs for PDFs from Supabase
//     const resultsWithUrls = await Promise.all(
//       searchResults.map(async (result) => {
//         const { data, error } = await supabaseClient.storage
//           .from('legal-pdfs')
//           .createSignedUrl(result.metadata.pdfPath, 3600) // 1 hour expiry

//         if (error || !data) {
//           console.error('Error getting signed URL:', error)
//           return {
//             ...result,
//             pdfUrl: null
//           }
//         }

//         return {
//           ...result,
//           pdfUrl: data.signedUrl
//         }
//       })
//     )

//     res.status(200).json(resultsWithUrls)
//   } catch (error) {
//     console.error('Search error:', error)
//     res.status(500).json({ error: 'Search failed' })
//   }
// }