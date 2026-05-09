import { NextResponse } from 'next/server';
import groq, { JUSTIVIA_SYSTEM_PROMPT, JUSTIVIA_CHAT_PROMPT } from '@/lib/groq';
import { getServerSession } from 'next-auth';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const session = await getServerSession();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: `${JUSTIVIA_SYSTEM_PROMPT}\n\n${JUSTIVIA_CHAT_PROMPT}` },
        ...messages
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_completion_tokens: 2048,
      top_p: 1,
      stream: false,
    });

    const responseContent = completion.choices[0]?.message?.content;

    return NextResponse.json({ 
      content: responseContent,
      role: 'assistant'
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
