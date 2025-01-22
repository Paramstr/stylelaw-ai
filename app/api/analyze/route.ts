import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const SYSTEM_PROMPT = `You are a legal theme analyzer. For each case chunk, identify the top 3 themes and assess its overall relevance to legal research.
You must respond with VALID JSON matching this EXACT structure:
{
  "themes": [
    {
      "theme_name": "string (formal legal category)",
      "strength": number (1-5, no quotes)
    },
    {
      "theme_name": "string (formal legal category)",
      "strength": number (1-5, no quotes)
    },
    {
      "theme_name": "string (formal legal category)",
      "strength": number (1-5, no quotes)
    }
  ],
  "relevance": {
    "score": number (0-100, no quotes),
    "reason": "string (brief explanation)"
  }
}

Rules for Theme Analysis:
1. Theme Strength: 
   - 5: Core legal holding or primary principle being discussed
   - 4: Major supporting legal principle or significant discussion
   - 3: Relevant but secondary legal concept
   - 2: Mentioned legal principle with minimal discussion
   - 1: Incidental or passing reference
2. Use standard legal terminology (e.g., "Due Process", "Stare Decisis")
3. Sort themes by descending strength
4. ALWAYS include exactly 3 themes

Rules for Relevance Scoring (0-100):
90-100: Landmark precedent or crucial holding
  - Establishes new legal principle
  - Overturns previous precedent
  - Definitive ruling on contested issue

75-89: Highly significant
  - Important application of established principles
  - Detailed analysis of legal concepts
  - Clear precedential value

50-74: Moderately significant
  - Standard application of law
  - Some useful analysis
  - Typical case example

25-49: Limited significance
  - Routine procedural matters
  - Brief or incomplete discussion
  - Highly fact-specific ruling

0-24: Minimal relevance
  - Procedural history
  - Background information
  - Non-substantive content

The reason field should specifically explain why the score was given based on these criteria.
NEVER use quotes around numbers, they must be pure numbers.
Ensure JSON is properly closed with all brackets matched.`

interface Theme {
  theme_name: string
  strength: number | string
}

interface RawTheme {
  theme_name?: string | number | null
  strength?: string | number | null
}

interface AnalysisResult {
  themes: Theme[]
  relevance: {
    score: number | string
    reason: string
  }
}

function sanitizeAnalysisResult(result: any): AnalysisResult {
  // Ensure themes array exists and has correct structure
  const themes = Array.isArray(result.themes) ? result.themes.slice(0, 3) : [];
  const sanitizedThemes = themes.map((theme: RawTheme) => ({
    theme_name: String(theme.theme_name || "Unknown Theme"),
    strength: Number(theme.strength) || 1
  }));

  // Fill in missing themes if needed
  while (sanitizedThemes.length < 3) {
    sanitizedThemes.push({
      theme_name: "Unknown Theme",
      strength: 1
    });
  }

  // Ensure relevance has correct structure
  const relevance = {
    score: Number(result.relevance?.score) || 0,
    reason: String(result.relevance?.reason || "Unable to determine relevance")
  };

  // Clamp values to valid ranges
  sanitizedThemes.forEach((theme: Theme) => {
    theme.strength = Math.max(1, Math.min(5, Number(theme.strength)));
  });
  relevance.score = Math.max(0, Math.min(100, Number(relevance.score)));

  return {
    themes: sanitizedThemes,
    relevance
  };
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user", 
          content: `Case Text: "${text}"`
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.1,
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content in response')
    }

    // Try to parse and validate the JSON structure
    try {
      const parsed = JSON.parse(content);
      const result = sanitizeAnalysisResult(parsed);
      return NextResponse.json(result);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content);
      // Return a fallback result instead of throwing
      const fallbackResult = sanitizeAnalysisResult({
        themes: [],
        relevance: { score: 0, reason: "Failed to analyze text" }
      });
      return NextResponse.json(fallbackResult);
    }
  } catch (error) {
    console.error('Analysis error:', error);
    // Return a fallback result instead of error status
    const fallbackResult = sanitizeAnalysisResult({
      themes: [],
      relevance: { score: 0, reason: "Failed to analyze text" }
    });
    return NextResponse.json(fallbackResult);
  }
} 