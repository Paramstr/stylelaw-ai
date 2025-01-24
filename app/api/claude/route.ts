import { NextRequest, NextResponse } from 'next/server';
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Define supported task types
export type ClaudeTask = 
  | { type: 'extract_metadata'; content: string }
  | { type: 'analyze_case'; content: string }
  | { type: 'summarize'; content: string };

export async function POST(request: NextRequest) {
  console.log('Claude API route called');
  
  try {
    const body = await request.json();
    const { task, systemPrompt } = body as { task: ClaudeTask; systemPrompt?: string };
    console.log('Received task:', { type: task.type, contentLength: task.content.length });

    if (!task || !task.type || !task.content) {
      console.error('Invalid request:', { task });
      return NextResponse.json(
        { error: 'Invalid request. Must include task type and content.' },
        { status: 400 }
      );
    }

    // Get the appropriate prompt based on task type
    let prompt = '';
    switch (task.type as ClaudeTask['type']) {
      case 'extract_metadata':
        prompt = `You are a legal document analyzer. Extract comprehensive metadata from the given legal case text. Format the response as a JSON object matching this TypeScript interface:

interface CaseData {
  pdfFile: string;
  coreInfo: {
    citation: string;
    title: string;
    shortTitle: string;
    court: string;
    jurisdiction: string;
    judgmentDate: string;
    hearingDates: string[];
    fileNumber: string;
    neutralCitation: string;
    status: string;
  };
  aiSummary: string; (200 words roughly)
  authorityStatus: {
    type: string;
    area: string;
    impact: string;
    previousAuthority?: string;
  };
  participants: {
    bench: Array<{
      name: string;
      role: string;
      isPrimary?: boolean;
    }>;
    counsel: Array<{
      name: string;
      party: string;
      firm?: string;
    }>;
    parties: {
      applicants: string[];
      respondents: string[];
      interventions?: string[];
    };
  };
  classification: {
    areasOfLaw: string[];
    subAreas: string[];
    industry: string[];
    proceeding: {
      type: string;
      level: string;
      nature: string;
    };
  };
  strategy: {
    keyIssues: Array<{
      issue: string;
      resolution: string;
      reasoning: string;
      significance: string;
      paragraphs: {
        issue: number[];
        resolution: number[];
        reasoning: number[];
      };
    }>;
    outcome: {
      summary: string;
      disposition: string[];
      remedy: string;
      costs: string;
      paragraphs: {
        disposition: number[];
        remedy: number[];
        costs: number[];
      };
    };
  };
}

Rules:
1. Extract ONLY factual information present in the text
2. Use empty arrays [] or empty strings "" if information is not found
3. Format dates consistently (e.g., "20 May 2024" for judgment dates)
4. Include complete names and titles where available
5. For paragraph references, use actual paragraph numbers from the text
6. Provide a concise but comprehensive AI summary
7. Be precise with legal terminology and classifications
8. If certain complex fields cannot be reliably extracted, use null or omit them
9. Focus on accuracy over completeness

Legal case text:`;
        break;

      case 'analyze_case':
        prompt = `Analyze the following legal case text and provide a structured analysis including:
1. Key legal principles
2. Main arguments
3. Court's reasoning
4. Implications and precedent value

Case text:`;
        break;

      case 'summarize':
        prompt = `Provide a concise but comprehensive summary of the following legal text, highlighting:
1. Main points
2. Key findings
3. Important conclusions

Text to summarize:`;
        break;

      default:
        console.error('Unsupported task type:', task.type);
        return NextResponse.json(
          { error: 'Unsupported task type' },
          { status: 400 }
        );
    }

    console.log('Calling Claude API with task:', task.type);
    // Call Claude API
    const completion = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4000,
      temperature: 0.1,
      system: systemPrompt || "You are a legal expert AI assistant. Be precise and accurate in your analysis.",
      messages: [
        {
          role: "user",
          content: prompt + "\n\n" + task.content,
        }
      ]
    });

    console.log('Received response from Claude:', {
      contentLength: 'text' in completion.content[0] ? completion.content[0].text.length : 0,
      hasContent: !!completion.content[0],
      contentType: completion.content[0]?.type
    });

    const content = completion.content[0];
    if (!content || !('text' in content)) {
      console.error('Unexpected Claude response format:', content);
      throw new Error("Unexpected response format from Claude");
    }

    // For metadata extraction, parse the JSON
    if (task.type === 'extract_metadata') {
      try {
        const metadata = JSON.parse(content.text);
        console.log('Successfully parsed metadata JSON');
        return NextResponse.json(metadata);
      } catch (error) {
        console.error('Failed to parse metadata JSON:', error);
        throw new Error('Failed to parse metadata response');
      }
    }

    // For other tasks, return the text directly
    console.log('Returning text response for task:', task.type);
    return NextResponse.json({ result: content.text });

  } catch (error) {
    console.error('Error in Claude API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
} 